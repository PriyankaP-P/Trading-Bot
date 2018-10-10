"use strict";

const fs = require("fs");
const database = require("./knexfile.js");
const date = new Date();
const balance = require("./checkBalance");
const exchanges = require("./exchanges");

async function get_price(symbol) {
  try {
    const response = await exchanges.fetchTicker(symbol);
    let last_price = response["last"];
    return last_price;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function cut_loss(stop_loss_percent) {
  try {
    let current_buys = await database("transactions")
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
    let percent_conv = stop_loss_percent / 100;
    let coin;
    let amount;
    for (let i = 0; i < current_buys.length; i++) {
      let buy_price = current_buys[i].price_base_currency;
      let criteria = buy_price - buy_price * percent_conv;
      let symbol_pair = current_buys[i].symbol_pair;
      let last_price = await get_price(symbol_pair);
      console.log(last_price);
      let open_sell_orders_for_stoploss = await database("transactions")
        .where({
          transaction_type: "sell",
          fulfilled: false,
          order_status: "open"
        })
        .select("selling_pair_id")
        .then(rows => rows)
        .catch(error => console.log(error));

      coin = symbol_pair.split("/");
      amount = await balance.account_balance(coin[0]);

      if (open_sell_orders_for_stoploss.length > 0) {
        for (let j = 0; j < open_sell_orders_for_stoploss.length; j++) {
          if (
            last_price <= criteria &&
            current_buys[i].transaction_id !==
              open_sell_orders_for_stoploss[j].selling_pair_id
          ) {
            //<=
            await database("transactions")
              .insert({
                trade_date: Date.now(),
                symbol_pair: symbol_pair,
                price_base_currency: last_price,
                quantity: amount,
                transaction_type: "sell",
                fulfilled: "f",
                order_status: "open",
                selling_pair_id: current_buys[i].transaction_id
              })
              .then(rows => rows)
              .catch(error => console.log(error));
            fs.appendFile(
              "log.txt",
              `${date}  stoploss created, filtered for duplicate, selling pair id = ${
                current_buys[i].transaction_id
              } \n`,
              error => {
                if (error) throw error;
              }
            );
          }
        }
      } else {
        if (last_price <= criteria) {
          //<=
          await database("transactions")
            .insert({
              trade_date: Date.now(),
              symbol_pair: symbol_pair,
              price_base_currency: last_price,
              quantity: amount,
              transaction_type: "sell",
              fulfilled: "f",
              order_status: "open",
              selling_pair_id: current_buys[i].transaction_id
            })
            .then(rows => rows)
            .catch(error => console.log(error));

          fs.appendFile(
            "log.txt",
            `${date}  stoploss created,first occurance, selling pair id = ${
              current_buys[i].transaction_id
            } \n`,
            error => {
              if (error) throw error;
            }
          );
        }
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

module.exports = {
  get_price,
  cut_loss
};
