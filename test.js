"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

(async function calculateEma() {
  try {
    await database("revenue")
      .insert({
        symbol_pair: "ADA/BTC",
        selling_pair_id: "2503c92e-1b09-4c0a-a519-2d275d38725c",
        buying_price: 0.097,
        quantity_bought: 11,
        selling_price: 1.075,
        quantity_sold: 10,
        percent_gain_loss: 1,
        base_currency_change: 0.03
      })
      .then(row => console.log(row))
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error + "Failed at ema func");
  }
})();
