"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

(async function calculateEma() {
  try {
    let processed_ohlcv = await exchanges.fetchOHLCV("ZIL/BTC", "1h");

    let period = 55;
    const close_price_index = 4;
    let ema = [];
    let arr = [];
    let prec;
    let multiplier = 2 / (period + 1);

    for (let count = 0; count < period; count++) {
      arr.push(processed_ohlcv[count][close_price_index]);
    }

    let sma_arr = arr.slice(0, period - 1);
    let sum = sma_arr.reduce((total, sma) => total + sma, 0);
    let sma1 = sum / period;
    ema.push(sma1);

    for (let i = 1; i < processed_ohlcv.length; i++) {
      let calc =
        multiplier * (processed_ohlcv[i][close_price_index] - ema[i - 1]) +
        ema[i - 1];
      if (processed_ohlcv[i][close_price_index] < 0.00009) prec = 11;
      else prec = 8;
      let result = Math.round(calc * Math.pow(10, prec)) / Math.pow(10, prec);
      ema.push(result);
    }
    let res = ema.reverse();
    for (let i = 0; i <= 10; i++) {
      console.log(res[i]);
    }
  } catch (error) {
    console.log(error + "Failed at ema func");
  }
})();
