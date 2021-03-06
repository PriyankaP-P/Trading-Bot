"use strict";

const database = require("./knexfile.js");
const stoploss = require("./stoploss");
const balance = require("./checkBalance");
const date = new Date();
const fs = require("fs");

const exchanges = require("./exchanges");

async function start_trailing() {
  try {
    let new_longs = await database("transactions")
      .where({
        transaction_type: "buy",
        fulfilled: "true",
        order_status: "closed",
        position_status: "new"
      })
      .whereNotNull("exchange_client_id")
      .select()
      .then(rows => rows)
      .catch(error => console.log(error));
    for (let i = 0; i < new_longs.length; i++) {
      let open_trailing_positions = await database("trail")
        .where("trailing_status", "true")
        .select("transaction_id")
        .then(rows => rows)
        .catch(error => console.log(error));

      let symbol_pair = new_longs[i].symbol_pair;
      let transac_id = new_longs[i].transaction_id;

      if (open_trailing_positions.length > 0) {
        for (let j = 0; j < open_trailing_positions; j++) {
          if (
            new_longs[i].transaction_id !==
            open_trailing_positions[j].transaction_id
          ) {
            let price = await stoploss.get_price(symbol_pair);
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
              "log.txt",
              `${date}  trailing started,scanned for duplicates, transac_id =  ${transac_id} trailing_price: ${price}\n`,
              error => {
                if (error) throw error;
              }
            );
          }
        }
      } else {
        let price = await stoploss.get_price(symbol_pair);
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
          "log.txt",
          `${date}  trailing started, transac_id =  ${transac_id} trailing_price: ${price}\n`,
          error => {
            if (error) throw error;
          }
        );
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
    let coin;
    let amount;
    let get_buy_pair_data = await database("transactions")
      .where("transaction_id", check_each_price.transaction_id)
      .select()
      .then(row => row)
      .catch(e => console.log(e));
    let symbol_pair = get_buy_pair_data[0].symbol_pair;
    coin = symbol_pair.split("/");
    amount = await balance.account_balance(coin[0]);

    await database("transactions")
      .insert({
        trade_date: Date.now(),
        symbol_pair: check_each_price.symbol_pair,
        price_base_currency: currentPrice,
        quantity: amount,
        transaction_type: "sell",
        fulfilled: "f",
        order_status: "open",
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
          order_status: "open"
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
            // let get_buy_pair_data = await database("transactions")
            //   .where("transaction_id", check_price[i].transaction_id)
            //   .select()
            //   .then(row => row)
            //   .catch(e => console.log(e));
            // let symbol_pair = get_buy_pair_data[0].symbol_pair;
            // coin = symbol_pair.split("/");
            // amount = await balance.account_balance(coin[0]);

            // await database("transactions")
            //   .insert({
            //     trade_date: Date.now(),
            //     symbol_pair: check_price[i].symbol_pair,
            //     price_base_currency: currentPrice,
            //     quantity: amount,
            //     transaction_type: "sell",
            //     fulfilled: "f",
            //     order_status: "open",
            //     selling_pair_id: get_buy_pair_data[0].transaction_id
            //   })
            //   .then(rows => rows)
            //   .catch(error => console.log(error));
          }
        }
      } else {
        if (to_check === true) {
          //true
          await db_entry(check_price[i], currentPrice);
          // let get_buy_pair_data = await database("transactions")
          //   .where("transaction_id", check_price[i].transaction_id)
          //   .select()
          //   .then(row => row)
          //   .catch(e => console.log(e));
          // let symbol_pair = get_buy_pair_data[0].symbol_pair;
          // coin = symbol_pair.split("/");
          // amount = await balance.account_balance(coin[0]);
          // //  console.log(get_buy_pair_data[0].equivalent_amt_base_currency);

          // await database("transactions")
          //   .insert({
          //     trade_date: Date.now(),
          //     symbol_pair: check_price[i].symbol_pair,
          //     price_base_currency: currentPrice,
          //     quantity: amount,
          //     transaction_type: "sell",
          //     fulfilled: "f",
          //     order_status: "open",
          //     selling_pair_id: get_buy_pair_data[0].transaction_id
          //   })
          //   .then(rows => rows)
          //   .catch(error => console.log(error));
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
          if (corresponding_sale[0].order_status === "closed") {
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
    // const trailing_percent = 1;
    await start_trailing();
    await update_highest_price();
    await update_trailing_stop();
    // await trailing_stop_func(trailing_percent);
  } catch (e) {
    console.log(e);
  }
}, 2000);

module.exports = {
  trailing_stop_func
};
