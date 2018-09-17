"use strict";

const trade = require("./trade");
const long = require("./long");
const isEqual = require("./isEqual");
const markets = require("./markets");
const orders = require("./orders");
const balances = require("./checkBalance");
const earnings = require("./earnings");
const trailing_stop = require("./trailing-stop");
const limitOrder = require("./limitOrder");
const maintenance = require("./maintenance");
const stoploss = require("./stoploss");
const date = new Date();

const start_time = +date;
console.log(start_time);

setInterval(async function app() {
  try {
      let time = new Date();
    const interval = "1h"; // also declared in long.js
    const standard_trade_currency = "BTC";
    let base_currency = "/" + standard_trade_currency;
    let daily_cutoff_vol = 700;
    const trade_amt = 0.005;
    const trailing_percent = 1;

    let local_symbols = await markets.symbolsUsed(
      base_currency,
      daily_cutoff_vol
    );
    let arr_to_scan = await orders.open_symbols(local_symbols);
    let isEqual_result = await isEqual.arr_list(arr_to_scan, interval);
    let available_balance = await balances.account_balance(
      standard_trade_currency
    );
        let currentTime = start_time + (180 * 60 * 60000);
        let nowTime =+time;
        console.log(`current time ${nowTime},,,, ${currentTime}`);
    if (nowTime >= (start_time + (1.5 * 60 * 60000))) {
      //(180 * 60 * 60000)
      await trade.call_trade_symbol(
        isEqual_result,
        available_balance,
        trade_amt
      );
      await trailing_stop.trailing_stop_func(trailing_percent);
      console.log("scan app works");
    } else {
      console.log("Scanning market");
    }
  } catch (e) {
    console.log(e);
  }
}, 20000);

setInterval(async function prevent_loss() {
  const stop_loss_percent = 2;
  await stoploss.cut_loss(stop_loss_percent);
}, 20000);
