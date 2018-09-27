"use strict";

const date = new Date();
const fs = require("fs");
const exchanges = require("./exchanges");
const database = require("./knexfile");
const trade = require("./trade");
const testBuy = require("./testBuy");

async function sellModel1() {
  let sell_list = await database("transactions")
    .where({
      transaction_type: "buy",
      fulfilled: true, //true
      order_status: "closed",
      position_status: "new"
    })
    .select()
    .then(rows => rows)
    .catch(error => console.log(error));

  console.log(sell_list);
  let marketStatus;
  for (let i = 0; i < sell_list.length; i++) {
    marketStatus = await database("marketema")
      .groupBy("marketema.id")
      .orderBy("entry_time", "desc")
      .having("symbol_pair", "=", sell_list[i].symbol_pair)
      .limit(8)
      .then(row => row)
      .catch(error => console.log(error));

      let startPosition = -1;
      let count = 0;
      let occurances = 0;
      for (let j = 0; j < marketStatus.length -1; j++) {
        let change21_55 = await testBuy.percent(
            marketStatus[j+1].percent_diff_21_55,
             marketStatus[j].percent_diff_21_55);
    let change13_55 = await testBuy.percent(
            marketStatus[j+1].percent_diff_13_55,
             marketStatus[j].percent_diff_13_55);

        let change8_55 = await testBuy.percent(
            marketStatus[j+1].percent_diff_8_55,
             marketStatus[j].percent_diff_8_55);
    
        if (
         change21_55 < 0 &&
         change13_55 < 0 &&
         change8_55 < 0
        ) {
          startPosition = j;
        } else {
          startPosition = -1;
        }
        occurances = 0;
        while (startPosition !== -1 && startPosition < marketStatus.length-1) {
            let change21_55 = await testBuy.percent(
                marketStatus[startPosition+1].percent_diff_21_55,
                 marketStatus[startPosition].percent_diff_21_55);
        let change13_55 = await testBuy.percent(
                marketStatus[startPosition+1].percent_diff_13_55,
                 marketStatus[startPosition].percent_diff_13_55);
    
            let change8_55 = await testBuy.percent(
                marketStatus[startPosition+1].percent_diff_8_55,
                 marketStatus[startPosition].percent_diff_8_55);
          if (
            change21_55 < 0 &&
            change13_55 < 0 &&
            change8_55 < 0
          ) {
            occurances = occurances + 1;
            count = startPosition;
            startPosition++;
          } else {
            startPosition = -1;
          }
        }
        if (occurances >= 6) {
          break;
        }
      }

      if (occurances >= 6) {
        console.log(`count=${count}`);

        console.log(
          `startPosition=${count -
            occurances +
            1}, occurances= ${occurances} ,symbol pair = ${
            marketStatus[count - occurances + 1].symbol_pair
          }, exchange timestamp = ${
            marketStatus[count - occurances + 1].exchange_time
          } id =${
            marketStatus[count - occurances + 1].id
          } , last occurance of negative at id= ${
            marketStatus[count].id //here count = count - occurances + 1 + (occurances - 1)
          }`
        );
      } else {
        console.log(
          'market not falling'
        );
      }

      let buyPosition = -1;

      if (occurances >= 5) {
        let endOfNegative = occurances;
        console.log(`endOfNegative = ${endOfNegative}`);
        for (
          let trailCount = endOfNegative;
          trailCount < marketStatus.length;
          trailCount++
        ) {
          if (
            marketStatus[trailCount].percent_diff_21_55 < 0 &&
            marketStatus[trailCount].percent_diff_13_55 > 0 &&
            marketStatus[trailCount].percent_diff_8_55 > 0
          ) {
            buyPosition = trailCount;
            break;
          }
        }

        if (buyPosition !== -1) {
          prospectiveBuys.push([
            marketStatus[buyPosition].id,
            marketStatus[buyPosition].symbol_pair,
            marketStatus[buyPosition].exchange_time
          ]);
          console.log(
            `buy ${marketStatus[buyPosition].symbol_pair} at position id = ${
              marketStatus[buyPosition].id
            }, exchange timestamp = ${marketStatus[buyPosition].exchange_time}`
          );
        }
      }
      console.log(prospectiveBuys);
      console.log("-------------------------------------------");
      
    }
















    let open_sell_orders = await database("transactions")
      .where({
        transaction_type: "sell",
        fulfilled: false,
        order_status: "open"
      })
      .select("selling_pair_id")
      .then(function(rows) {
        return rows;
      })
      .catch(function(error) {
        console.log(error);
      });

    if (open_sell_orders.length > 0) {
      for (let j = 0; j < open_sell_orders.length; j++) {
        if (
          condition === true &&
          timePassed > timePassed + delay * 5 * 60000 &&
          sell_list[i].transaction_id !== open_sell_orders[j].selling_pair_id
        ) {
          await update_sell_orders(sell_list[i], action);
          console.log("checking for sell condition ");
        } else {
          console.log("condition not met");
        }
      }
    } else {
      if (
        condition === true &&
        timePassed > timePassed + delay * 2 * 60 * 1000
      ) {
        await update_sell_orders(sell_list[i], action);
        console.log("checking for sell condition");
      } else {
        console.log("condition not met");
      }
    }
  }
}
