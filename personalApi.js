"use strict";

const ccxt = require("ccxt");

let binance = new ccxt.binance({
  apiKey: "****************",
  secret: "****************"
});

module.exports = binance;
