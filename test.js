"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

(async function calculateEma() {
  try {
    let list = await database("possibletrades")
      .orderBy("entry_time", "desc")
      .limit(1)
      .then(row => row)
      .catch(error => console.log(error));

    console.log(list[0].coins);
    // await database("transactions")
    //   .insert({
    //     trade_date: Date.now(),
    //     symbol_pair: "ETH/BTC",
    //     price_base_currency: 0.0012,
    //     quantity: 1,
    //     transaction_type: "buy",
    //     fulfilled: "t",
    //     order_status: "PARTIALLY_FILLED",
    //     exchange_client_id: "63348248",
    //     exchange_timestamp: 1536359648561,
    //     position_status: "new"
    //   })
    // .where("transaction_id", "a178d65e-e24b-43b5-ba9b-a9bd7dbdf921")
    // .delete()
    // // .update({
    // //   // quantity: 11,
    // //   // fulfilled: "f"
    // //   // order_status: "FILLED",
    // //   // exchange_client_id: "93348248",
    // //   // exchange_timestamp: 1536359659561,
    // //   position_status: "new"
    // // })
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
