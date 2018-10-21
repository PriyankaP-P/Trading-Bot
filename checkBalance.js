"use strict";
const binance = require("./personalApi");

async function account_balance(symbol) {
  try {
    let balance = await binance.fetchBalance();
    let trade_balance = balance.info.balances.filter(
      each => each.asset === symbol
    );
    let base_balance = trade_balance[0].free;
    return base_balance;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed check balance");
  }
}

module.exports = {
  account_balance
};
