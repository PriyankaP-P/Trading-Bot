"use strict";

const date = new Date();
const fs = require("fs");
const database = require("./knexfile");

(async function sellModel1() {
  let existing_entries = await database("revenue")
    .select("selling_pair_id")
    .then(row => row)
    .catch(error => console.log(error));

  console.log(existing_entries.length);
  if (existing_entries.length > 0) {
    for (let j = 0; j < existing_entries.length; j++) {
      if (
        existing_entries[j].selling_pair_id !==
        "2503c92e-1b09-4c0a-a519-2d275d38725c"
      ) {
        console.log("new entry");
        await database("revenue")
          .insert({
            symbol_pair: "ETH/BTC",
            selling_pair_id: "8503c92e-1b09-4c0a-a519-2d275d38725c",
            buying_price: 0.097,
            quantity_bought: 11,
            selling_price: 1.075,
            quantity_sold: 10,
            percent_gain_loss: 1
          })
          .then(row => console.log(row))
          .catch(error => console.log(error));
      }
    }
  } else {
    await database("revenue")
      .insert({
        symbol_pair: "ETH/BTC",
        selling_pair_id: "8503c92e-1b09-4c08-a519-2d275d38925c",
        buying_price: 0.097,
        quantity_bought: 11,
        selling_price: 1.075,
        quantity_sold: 10,
        percent_gain_loss: 1
      })
      .then(row => console.log(row))
      .catch(error => console.log(error));
    console.log("First entry");
  }
})();

// "use strict";

// const database = require("./knexfile");
// const fs = require("fs");
// const date = new Date();

// (async function open_symbols(list) {
//   // let open_arr = [];
//   // let filtered_symbols = [];

//   // let response = await database("transactions")
//   //   .where("transaction_type", "buy")
//   //   .select("symbol_pair", "trade_date")
//   //   .then(function(rows) {
//   //     return rows;
//   //   })
//   //   .catch(function(error) {
//   //     console.log(error);
//   //   });

//   // console.log(response);
//   // for (let i = 0; i < response.length; i++) {
//   //   let buy_time = response[i].trade_date;
//   //   let time_passed_since_last_trade =
//   //     (Date.now() - buy_time) / (60 * 60 * 1000);

//   //   console.log(time_passed_since_last_trade);
//   //   if (time_passed_since_last_trade <= 24) {
//   //     open_arr.push(response[i].symbol_pair);
//   //     console.log(
//   //       `Timed out coins = ${
//   //         response[i].symbol_pair
//   //       }, please wait 24 hours before purchase `
//   //     );
//   //   }
//   // }
//   // console.log(open_arr);
//   // fs.appendFile("log.txt", `${date} open_arr =  ${open_arr} \n`, error => {
//   //   if (error) throw error;
//   // });
//   // let new_open_arr = open_arr.filter(function(elem, pos) {
//   //   return open_arr.indexOf(elem) == pos;
//   // });
//   // console.log(`new_open_arr = ${new_open_arr}`);
//   fs.appendFile(
//     "log.txt",
//     `${date} new_open_arr =  ${new_open_arr} \n`,
//     error => {
//       if (error) throw error;
//     }
//   );
//   filtered_symbols = list.filter(item =>
//     new_open_arr.every(item2 => item2 !== item)
//   );
//   console.log(`filtered_symbols =  ${filtered_symbols}`);
//   fs.appendFile(
//     "log.txt",
//     `${date} filtered_symbols =  ${filtered_symbols} \n`,
//     error => {
//       if (error) throw error;
//     }
//   );

//   console.log(filtered_symbols);
// })();
