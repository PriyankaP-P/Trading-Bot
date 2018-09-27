"use strict";

const ccxt = require("ccxt");
const exchanges = new ccxt["binance"]({
  enableRateLimit: true,
  options: {
    verbose: true
  }
});

module.exports = exchanges;
