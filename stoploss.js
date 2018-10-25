"use strict";

const fs = require("fs");
const database = require("./knexfile.js");
const date = new Date();
const balance = require("./checkBalance");
const exchanges = require("./exchanges");

async function cut_loss(stop_loss_percent) {
  try {
    let current_buys = await database("transactions")
      .where({
        transaction_type: "buy",
        fulfilled: "true",
        order_status: "FILLED",
        position_status: "new"
      })
      .whereNotNull("exchange_client_id")
      .select()
      .then(rows => rows)
      .catch(error => console.log(error));
    let percent_conv = stop_loss_percent / 100;
    let coin;
    let amount;
    let sellOrderAmount;
    for (let i = 0; i < current_buys.length; i++) {
      let buy_price = current_buys[i].price_base_currency;
      let criteria = buy_price - buy_price * percent_conv;
      let symbol_pair = current_buys[i].symbol_pair;

      const response = await exchanges.fetchTicker(symbol_pair);
      let last_price = response["last"];

      const alreadyExists = await database("transactions")
        .count("selling_pair_id", current_buys[i].transaction_id)
        .then(row => row)
        .catch(e => console.log(e));

      const countAlreadyExistingOccurances = parseInt(alreadyExists[0].count);

      coin = symbol_pair.split("/");
      amount = await balance.account_balance(coin[0]);

      if (amount > current_buys[i].quantity)
        sellOrderAmount = current_buys[i].quantity;
      else sellOrderAmount = amount;

      if (last_price <= criteria && countAlreadyExistingOccurances == 0) {
        //<=
        await database("transactions")
          .insert({
            trade_date: Date.now(),
            symbol_pair: symbol_pair,
            price_base_currency: last_price,
            quantity: sellOrderAmount,
            transaction_type: "sell",
            fulfilled: "f",
            order_status: "CREATED",
            selling_pair_id: current_buys[i].transaction_id
          })
          .then(rows => rows)
          .catch(error => console.log(error));
        fs.appendFile(
          "log.txt",
          `${date}  stoploss created,for selling pair id = ${
            current_buys[i].transaction_id
          } \n`,
          error => {
            if (error) throw error;
          }
        );
      } else {
        console.log(
          `Stoploss not hit for selling pair id = ${
            current_buys[i].transaction_id
          }`
        );
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed at stoploss function");
  }
}

module.exports = {
  cut_loss
};
