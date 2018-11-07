"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();
const balance = require("./checkBalance");
const binance = require("./personalApi");

(async function calculateEma() {
  try {
    let a = await database("transactions")
      .where("transaction_id", "9d0e350f-34e3-45d4-8686-2bfacef3c471")
      .update({
        fulfilled: "t",
        order_status: "FILLED",
        exchange_client_id: "888871",
        exchange_timestamp: 1540432882370,
        position_status: "old"
      })
      //   .insert({
      //     trade_date: Date.now(),
      //     symbol_pair: "TRX/BTC",
      //     price_base_currency: 0.00001047,
      //     quantity: 1.91971696,
      //     transaction_type: "buy",
      //     fulfilled: "t",
      //     order_status: "FILLED",
      //     exchange_client_id: "888871",
      //     exchange_timestamp: 1540432882370,
      //     position_status: "new"
      //   })

      .then(row => console.log(row))
      .catch(e => console.log(e));
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

// async function start_trailing() {
//   try {
//     let new_longs = await database("transactions")
//       .where({
//         transaction_type: "buy",
//         fulfilled: "true",
//         order_status: "FILLED",
//         position_status: "new"
//       })
//       .whereNotNull("exchange_client_id")
//       .select()
//       .then(rows => rows)
//       .catch(error => console.log(error));
//     console.log(new_longs.length);
//     for (let i = 0; i < new_longs.length; i++) {
//       let symbol_pair = new_longs[i].symbol_pair;
//       let transac_id = new_longs[i].transaction_id;

//       let price = await stoploss.get_price(symbol_pair);

//       let alreadyPresent = await database("trail")
//         .whereNotExists(
//           database
//             .select()
//             .from("trail")
//             .whereRaw("transaction_id" !== transac_id)
//         )
//         .then(row => row)
//         .catch(error => console.log(error));
//       console.log(alreadyPresent);
//       while (alreadyPresent.length !== 0) {
//         await database("trail")
//           .insert({
//             transaction_id: transac_id,
//             symbol_pair: symbol_pair,
//             trailing_price: price,
//             trailing_status: "t"
//           })
//           .then(row => row)
//           .catch(error => console.log(error));

//         fs.appendFile(
//           "trailLogs.txt",
//           `${date}  checked for duplicates, trailing started, transac_id =  ${transac_id} trailing_price: ${price}\n`,
//           error => {
//             if (error) throw error;
//           }
//         );
//       }
//       console.log("trailing started");
//       fs.appendFile(
//         "trailLogs.txt",
//         `${date}  trailing started, transac_id =  ${transac_id} trailing_price: ${price}\n`,
//         error => {
//           if (error) throw error;
//         }
//       );
//     }
//     console.log("----------");
//   } catch (error) {
//     console.log(` Bot malfunctioning at trailing-stop function: ${error}`);
//   }
// }
