"use strict";
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();
const exchanges = require("./exchanges");

async function getPrice(symbol, action) {
  let finalPrice;
  const response = await exchanges.fetchTicker(symbol);
  let lastPrice = response["last"];
  if (action === "buy") {
    finalPrice = lastPrice - lastPrice * 0.0003; //  enter bid price at 0.03% lower than current bid
  } else if (action === "sell") {
    finalPrice = lastPrice + lastPrice * 0.0003;
  }
  let rounded_price =
    Math.round(finalPrice * Math.pow(10, 8)) / Math.pow(10, 8);
  console.log(`last price = ${lastPrice}`);
  console.log(`Placing order for symbol=${symbol} at price = ${rounded_price}`);
  return finalPrice;
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
      console.log(`Price = ${price}`);
      let quantity = trade_amt / price;
      console.log(`quantity = ${quantity}`);

      console.log(`Buying ${tradingPairs[i]} at price = ${price}`);
      fs.appendFile(
        "log.txt",
        `${date} - Buying  ${tradingPairs[i]} at price = ${price} \n`,
        error => {
          if (error) throw error;
        }
      );

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

        available_balance = available_balance - trade_amt;
      } else {
        console.log("insufficient base currency balance");
        fs.appendFile(
          "log.txt",
          `${date}  insufficient base currency balance \n`,
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
