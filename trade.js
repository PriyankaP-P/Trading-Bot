"use strict";
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();
const exchanges = require("./exchanges");

async function getPrice(symbol, action) {
  try {
    let finalPrice;
    const response = await exchanges.fetchTicker(symbol);
    let lastPrice = response["last"];
    if (action === "buy") {
      finalPrice = lastPrice - lastPrice * 0.001; //  enter bid price at 0.1% lower than current bid
    } else if (action === "sell") {
      finalPrice = lastPrice + lastPrice * 0.001;
    }
    let rounded_price =
      Math.round(finalPrice * Math.pow(10, 8)) / Math.pow(10, 8);
    console.log(`last price = ${lastPrice}`);
    // console.log(
    //   `Placing order for symbol=${symbol} at price = ${rounded_price}`
    // );
    return finalPrice;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function record(tradingPairs, available_balance, trade_amt) {
  //get total balance
  try {
    console.log(`available_balance = ${available_balance}`);
    let amount = available_balance;
    const action = "buy";
    console.log("amount = " + amount);
    fs.appendFile(
      "log.txt",
      `${date}  available balance(amount) = ${amount} \n`,
      error => {
        if (error) throw error;
      }
    );
    for (let i = 0; i < tradingPairs.length; i++) {
      let price = await getPrice(tradingPairs[i], action);

      let quantity = trade_amt / price;

      if (available_balance > trade_amt) {
        let addEntry = await database("transactions")
          .insert({
            trade_date: Date.now(),
            symbol_pair: tradingPairs[i],
            price_base_currency: price,
            quantity: quantity,
            transaction_type: "buy",
            fulfilled: "f",
            order_status: "CREATED"
          })
          .then(row => row)
          .catch(err => console.log(err));

        console.log(`Price = ${price}`);
        console.log(`quantity = ${quantity}`);
        console.log(`Buying ${tradingPairs[i]} at price = ${price}`);
        fs.appendFile(
          "log.txt",
          `${date} - Buying  ${tradingPairs[i]} at price = ${price} \n`,
          error => {
            if (error) throw error;
          }
        );
        available_balance = available_balance - trade_amt;
      } else {
        console.log(
          "Insufficient base currency balance, wait for base currency balance to be available"
        );
        fs.appendFile(
          "log.txt",
          `${date}  Insufficient base currency balance, wait for base currency balance to be available \n`,
          error => {
            if (error) throw error;
          }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function call_trade_symbol(tradingPairs, available_balance, trade_amt) {
  try {
    await record(tradingPairs, available_balance, trade_amt);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getPrice,
  record,
  call_trade_symbol
};
