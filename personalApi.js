"use strict";

const ccxt = require("ccxt");

let binance = new ccxt.binance({
  apiKey: "Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl",
  secret: "5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4"
});

module.exports = binance;
