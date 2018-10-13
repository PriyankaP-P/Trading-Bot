"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

(async function calculateEma() {
  try {
    await database("transactions")
      .where("transaction_id", "48a7ecd8-62c0-4d1f-a204-90c9246334df")
      .update({
        // quantity: 11,
        fulfilled: "f"
        // order_status: "FILLED",
        // exchange_client_id: "93348248",
        // exchange_timestamp: 1536359659561,
        // position_status: "new"
      })
      .then(row => console.log(row))
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error + "Failed at ema func");
  }
})();

// symbol_pair: "ADA/BTC",
// selling_pair_id: "2503c92e-1b09-4c0a-a519-2d275d38725c",
// buying_price: 0.097,
// quantity_bought: 11,
// selling_price: 1.075,
// quantity_sold: 10,
// percent_gain_loss: 1,
// base_currency_change: 0.03

// .insert({
//   trade_date: Date.now(),
//   symbol_pair: "ADA/BTC",
//   price_base_currency: 0.001234,
//   quantity: 11,
//   transaction_type: "buy",
//   fulfilled: "t",
//   order_status: "FILLED",
//   exchange_client_id: "63348248",
//   exchange_timestamp: 1536359648561,
//   position_status: "new"
// })
