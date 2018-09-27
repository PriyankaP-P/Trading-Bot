"use strict";

const date = new Date();
const fs = require("fs");
const exchanges = require("./exchanges");
const database = require("./knexfile");
const trade = require("./trade");
const testBuy = require("./testBuy");

setInterval(async function sellModel1() {
  try {
    let sell_list = await database("transactions")
      .where({
        transaction_type: "buy",
        fulfilled: false, //true
        order_status: "open"
        // ,position_status: "new"
      })
      .select()
      .then(rows => rows)
      .catch(error => console.log(error));

    console.log(sell_list);

    for (let i = 0; i < sell_list.length; i++) {
      let marketStatus = await database("marketema")
        .groupBy("marketema.id")
        .orderBy("entry_time", "desc")
        .having("symbol_pair", "=", sell_list[i].symbol_pair)
        .limit(8)
        .then(row => row)
        .catch(error => console.log(error));

      let startPosition = -1;
      let count = 0;
      let occurances = 0;
      // console.log(marketStatus.length);

      for (let j = 0; j < marketStatus.length - 1; j++) {
        let change21_55 = await think.percent(
          marketStatus[j + 1].percent_diff_21_55,
          marketStatus[j].percent_diff_21_55
        );
        // console.log(change21_55);
        let change13_55 = await think.percent(
          marketStatus[j + 1].percent_diff_13_55,
          marketStatus[j].percent_diff_13_55
        );
        // console.log(change13_55);

        let change8_55 = await think.percent(
          marketStatus[j + 1].percent_diff_8_55,
          marketStatus[j].percent_diff_8_55
        );
        // console.log(change8_55);

        if (change21_55 < 0 && change13_55 < 0 && change8_55 < 0) {
          startPosition = j;
        } else {
          startPosition = -1;
        }
        occurances = 0;
        while (
          startPosition !== -1 &&
          startPosition < marketStatus.length - 1
        ) {
          let change21_55 = await think.percent(
            marketStatus[startPosition + 1].percent_diff_21_55,
            marketStatus[startPosition].percent_diff_21_55
          );
          let change13_55 = await think.percent(
            marketStatus[startPosition + 1].percent_diff_13_55,
            marketStatus[startPosition].percent_diff_13_55
          );

          let change8_55 = await think.percent(
            marketStatus[startPosition + 1].percent_diff_8_55,
            marketStatus[startPosition].percent_diff_8_55
          );
          if (change21_55 < 0 && change13_55 < 0 && change8_55 < 0) {
            occurances = occurances + 1;
            count = startPosition;
            startPosition++;
          } else {
            startPosition = -1;
          }
        }
        if (occurances === 7) {
          break;
        }
      }

      if (occurances === 7) {
        console.log(
          `Time to sell ${marketStatus[marketStatus.length - 1].symbol_pair}, ${
            marketStatus[marketStatus.length - 1].exchange_time
          } , ${marketStatus[marketStatus.length - 1].id} `
        );
        fs.appendFile(
          "buyLogs.txt",
          `date = ${date}, Time to sell ${
            marketStatus[marketStatus.length - 1].symbol_pair
          }, ${marketStatus[marketStatus.length - 1].exchange_time} , ${
            marketStatus[marketStatus.length - 1].id
          } \n`,
          error => {
            if (error) throw error;
          }
        );
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}, 10000);

// let open_sell_orders = await database("transactions")
// .where({
//   transaction_type: "sell",
//   fulfilled: false,
//   order_status: "open"
// })
// .select("selling_pair_id")
// .then(function(rows) {
//   return rows;
// })
// .catch(function(error) {
//   console.log(error);
// });

// if (open_sell_orders.length > 0) {
// for (let j = 0; j < open_sell_orders.length; j++) {
//   if (
//     condition === true &&
//     timePassed > timePassed + delay * 5 * 60000 &&
//     sell_list[i].transaction_id !== open_sell_orders[j].selling_pair_id
//   ) {
//     await update_sell_orders(sell_list[i], action);
//     console.log("checking for sell condition ");
//   } else {
//     console.log("condition not met");
//   }
// }
// } else {
// if (
//   condition === true &&
//   timePassed > timePassed + delay * 2 * 60 * 1000
// ) {
//   await update_sell_orders(sell_list[i], action);
//   console.log("checking for sell condition");
// } else {
//   console.log("condition not met");
// }

// }
