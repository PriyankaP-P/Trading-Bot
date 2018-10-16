"use strict";

const database = require("./knexfile.js");
const stoploss = require("./stoploss");
const balance = require("./checkBalance");
const date = new Date();
const fs = require("fs");

async function start_trailing() {
  try {
    let new_longs = await database("transactions")
      .where({
        transaction_type: "buy",
        fulfilled: "true",
        order_status: "FILLED",
        position_status: "new"
      })
      .orWhere({
        transaction_type: "buy",
        fulfilled: "true",
        order_status: "PARTIALLY_FILLED",
        position_status: "new"
      })
      .whereNotNull("exchange_client_id")
      .select()
      .then(rows => rows)
      .catch(error => console.log(error));

    for (let i = 0; i < new_longs.length; i++) {
      let open_trailing_positions = await database("trail")
        .select("transaction_id")
        .then(rows => rows)
        .catch(error => console.log(error));

      let symbol_pair = new_longs[i].symbol_pair;
      let transac_id = new_longs[i].transaction_id;
      let price = await stoploss.get_price(symbol_pair);
      let count = 0;
      if (open_trailing_positions.length > 0) {
        for (let j = 0; j < open_trailing_positions.length; j++) {
          if (
            new_longs[i].transaction_id !==
            open_trailing_positions[j].transaction_id
          ) {
            count = 0;
          } else {
            count = 1;
            break;
          }
        }
      }
      if (count === 0 || open_trailing_positions.length === 0) {
        await database("trail")
          .insert({
            transaction_id: transac_id,
            symbol_pair: symbol_pair,
            trailing_price: price,
            trailing_status: "t"
          })
          .then(row => row)
          .catch(error => console.log(error));
        console.log("trailing started");
        fs.appendFile(
          "trailLogs.txt",
          `${date}  trailing started transac_id =  ${transac_id} trailing_price: ${price}\n`,
          error => {
            if (error) throw error;
          }
        );
      } else {
        console.log("No new trailing positions");
      }
    }
  } catch (error) {
    console.log(` Bot malfunctioning at trailing-stop function: ${error}`);
  }
}

async function update_highest_price() {
  try {
    let open_trail = await database("trail")
      .where("trailing_status", "true")
      .select()
      .then(row => row)
      .catch(e => console.log(e));
    for (let i = 0; i < open_trail.length; i++) {
      let updated_price = await stoploss.get_price(open_trail[i].symbol_pair);
      if (updated_price > open_trail[i].trailing_price) {
        //>
        await database("trail")
          .where("transaction_id", open_trail[i].transaction_id)
          .update("trailing_price", updated_price)
          .then(row => row)
          .catch(e => console.log(e));
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function db_entry(check_each_price, currentPrice) {
  try {
    console.log("check_each_price");
    console.log(check_each_price);
    console.log("))))");
    let coin;
    let amount;
    let sellOrderAmount;
    let get_buy_pair_data = await database("transactions")
      .where("transaction_id", check_each_price.transaction_id)
      .select()
      .then(row => row)
      .catch(e => console.log(e));
    let symbol_pair = get_buy_pair_data[0].symbol_pair;
    coin = symbol_pair.split("/");
    amount = await balance.account_balance(coin[0]);

    if (amount > get_buy_pair_data[0].quantity)
      sellOrderAmount = get_buy_pair_data[0].quantity;
    else sellOrderAmount = amount;

    await database("transactions")
      .insert({
        trade_date: Date.now(),
        symbol_pair: check_each_price.symbol_pair,
        price_base_currency: currentPrice,
        quantity: sellOrderAmount,
        transaction_type: "sell",
        fulfilled: "f",
        order_status: "CREATED",
        selling_pair_id: get_buy_pair_data[0].transaction_id
      })
      .then(rows => rows)
      .catch(error => console.log(error));
  } catch (e) {
    console.log(e);
  }
}

async function trailing_stop_func(trailing_percent) {
  try {
    let currentPrice;
    let coin;
    let amount;
    let percent_conv = trailing_percent / 100;
    let check_price = await database("trail")
      .where("trailing_status", "true")
      .select()
      .then(row => row)
      .catch(e => console.log(e));

    for (let i = 0; i < check_price.length; i++) {
      currentPrice = await stoploss.get_price(check_price[i].symbol_pair);
      let price_condition =
        check_price[i].trailing_price -
        check_price[i].trailing_price * percent_conv;
      let to_check = currentPrice <= price_condition;
      // console.log(to_check);

      let open_sell_orders_for_trailing = await database("transactions")
        .where({
          transaction_type: "sell",
          fulfilled: false,
          order_status: "CREATED"
        })
        .select("selling_pair_id")
        .then(rows => rows)
        .catch(error => console.log(error));
      if (open_sell_orders_for_trailing.length > 0) {
        for (let j = 0; j < open_sell_orders_for_trailing.length; j++) {
          if (
            to_check === true &&
            check_price[i].transaction_id !==
              open_sell_orders_for_trailing[j].selling_pair_id
          ) {
            await db_entry(check_price[i], currentPrice);
          }
        }
      } else {
        if (to_check === true) {
          //true
          await db_entry(check_price[i], currentPrice);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function update_trailing_stop() {
  try {
    let fetch_closed = await database("trail")
      .where("trailing_status", "true")
      .select("transaction_id")
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    if (fetch_closed.length > 0) {
      for (let i = 0; i < fetch_closed.length; i++) {
        let corresponding_sale = await database("transactions")
          .where("selling_pair_id", fetch_closed[i].transaction_id)
          .select("order_status")
          .then(function(row) {
            return row;
          })
          .catch(function(err) {
            console.log(err);
          });

        if (corresponding_sale.length > 0) {
          if (
            corresponding_sale[0].order_status === "FILLED" ||
            corresponding_sale[0].order_status === "PARTIALLY_FILLED"
          ) {
            await database("trail")
              .where("transaction_id", fetch_closed[i].transaction_id)
              .update("trailing_status", "false")
              .then(function(row) {
                return row;
              })
              .catch(function(err) {
                console.log(err);
              });
          } else {
            console.log("no closed orders");
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

setInterval(async function call_all() {
  try {
    const trailing_percent = 2.5;
    await start_trailing();
    await update_highest_price();
    await update_trailing_stop();
    await trailing_stop_func(trailing_percent);
  } catch (e) {
    console.log(e);
  }
}, 2000);

// module.exports = {
//   trailing_stop_func
// };
