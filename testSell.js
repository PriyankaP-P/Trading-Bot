"use strict";

const date = new Date();
const fs = require("fs");
const database = require("./knexfile");
const trade = require("./trade");
const testBuy = require("./testBuy");
const balance = require("./checkBalance");

async function sellModel1(symbol) {
  try {
    let action = "wait";

    let marketStatus = await database("marketema")
      .groupBy("marketema.id")
      .orderBy("entry_time", "desc")
      .having("symbol_pair", "=", symbol)
      .limit(8)
      .then(row => row)
      .catch(error => console.log(error));

    let startPosition = -1;
    let count = 0;
    let occurances = 0;
    // console.log(marketStatus.length);

    for (let j = 0; j < marketStatus.length - 1; j++) {
      let change21_55 = await testBuy.percent(
        marketStatus[j + 1].percent_diff_21_55,
        marketStatus[j].percent_diff_21_55
      );
      // console.log(change21_55);
      let change13_55 = await testBuy.percent(
        marketStatus[j + 1].percent_diff_13_55,
        marketStatus[j].percent_diff_13_55
      );
      // console.log(change13_55);

      let change8_55 = await testBuy.percent(
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
      while (startPosition !== -1 && startPosition < marketStatus.length - 1) {
        let change21_55 = await testBuy.percent(
          marketStatus[startPosition + 1].percent_diff_21_55,
          marketStatus[startPosition].percent_diff_21_55
        );
        let change13_55 = await testBuy.percent(
          marketStatus[startPosition + 1].percent_diff_13_55,
          marketStatus[startPosition].percent_diff_13_55
        );

        let change8_55 = await testBuy.percent(
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
      if (occurances >= 3) {
        break;
      }
    }

    if (occurances >= 3) {
      action = "sell";
      console.log(
        `Time to sell ${marketStatus[marketStatus.length - 1].symbol_pair}, ${
          marketStatus[marketStatus.length - 1].exchange_time
        } , ${marketStatus[marketStatus.length - 1].id} `
      );
      fs.appendFile(
        "sellLogs.txt",
        `date = ${date}, Time to sell ${
          marketStatus[marketStatus.length - 1].symbol_pair
        }, ${marketStatus[marketStatus.length - 1].exchange_time} , ${
          marketStatus[marketStatus.length - 1].id
        } \n`,
        error => {
          if (error) throw error;
        }
      );
      console.log(`Action for sell time -model1- symbol ${symbol} = ${action}`);
    } else {
      fs.appendFile(
        "sellLogs.txt",
        `date = ${date}, Action for sell time -model1- symbol ${symbol} = ${action} \n`,
        error => {
          if (error) throw error;
        }
      );
      console.log(`Action for sell time -model1- symbol ${symbol} = ${action}`);
    }
    return action;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function sellModel2(symbol) {
  try {
    let action = "wait";

    let marketStatus = await database("marketema")
      .groupBy("marketema.id")
      .orderBy("entry_time", "desc")
      .having("symbol_pair", "=", symbol)
      .limit(8)
      .then(row => row)
      .catch(error => console.log(error));

    let startPosition = -1;
    let count = 0;
    let occurances = 0;
    for (let j = 0; j < marketStatus.length; j++) {
      if (
        marketStatus[j].percent_diff_21_55 > 0 &&
        marketStatus[j].percent_diff_13_55 > 0 &&
        marketStatus[j].percent_diff_8_55 > 0
      ) {
        startPosition = j;
      } else {
        startPosition = -1;
      }
      occurances = 0;
      while (startPosition !== -1 && startPosition < marketStatus.length) {
        if (
          marketStatus[startPosition].percent_diff_21_55 > 0 &&
          marketStatus[startPosition].percent_diff_13_55 > 0 &&
          marketStatus[startPosition].percent_diff_8_55 > 0
        ) {
          occurances = occurances + 1;
          count = startPosition;
          startPosition++;
        } else {
          startPosition = -1;
        }
      }
      if (occurances >= 1) {
        break;
      }
    }

    if (occurances >= 1) {
      for (
        let trailCount = count;
        trailCount < marketStatus.length;
        trailCount++
      ) {
        if (
          (marketStatus[trailCount].percent_diff_21_55 > 0 &&
            marketStatus[trailCount].percent_diff_13_55 > 0 &&
            marketStatus[trailCount].percent_diff_8_55 < 0) ||
          (marketStatus[trailCount].percent_diff_21_55 > 0 &&
            marketStatus[trailCount].percent_diff_13_55 < 0 &&
            marketStatus[trailCount].percent_diff_8_55 < 0) ||
          (marketStatus[trailCount].percent_diff_21_55 < 0 &&
            marketStatus[trailCount].percent_diff_13_55 < 0 &&
            marketStatus[trailCount].percent_diff_8_55 < 0)
        ) {
          action = "sell";
          console.log(
            `Time to sell ${
              marketStatus[marketStatus.length - 1].symbol_pair
            }, ${marketStatus[marketStatus.length - 1].exchange_time} , ${
              marketStatus[marketStatus.length - 1].id
            } `
          );
          fs.appendFile(
            "sellLogs.txt",
            `date = ${date}, Time to sell ${
              marketStatus[marketStatus.length - 1].symbol_pair
            }, ${marketStatus[marketStatus.length - 1].exchange_time} , ${
              marketStatus[marketStatus.length - 1].id
            }, count= ${count} \n`,
            error => {
              if (error) throw error;
            }
          );
          console.log(
            `Action for sell time -model2- symbol ${symbol} = ${action}`
          );
          break;
        }
      }
    }
    return action;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function update_sell_orders(entry, action) {
  const trans_type = "sell";
  let symbol = entry.symbol_pair;
  let price = await trade.getPrice(entry.symbol_pair, action);
  let coin = symbol.split("/");
  let amount = await balance.account_balance(coin[0]); // correct to only amount used in particular trade, subtract exchange fees

  await database("transactions")
    .insert({
      trade_date: Date.now(),
      symbol_pair: entry.symbol_pair,
      price_base_currency: price,
      quantity: amount,
      transaction_type: trans_type,
      fulfilled: "f",
      order_status: "CREATED",
      selling_pair_id: entry.transaction_id
    })
    .then(row => row)
    .catch(err => console.log(err));
}

async function createSellOrder() {
  try {
    let action = "";
    let sell_list = await database("transactions")
      .where({
        transaction_type: "buy",
        fulfilled: true, //true
        order_status: "FILLED",
        position_status: "new"
      })
      .select()
      .then(rows => rows)
      .catch(error => console.log(error));

    console.log(sell_list);
    for (let i = 0; i < sell_list.length; i++) {
      let action1 = await sellModel1(sell_list[i].symbol_pair);
      let action2 = await sellModel2(sell_list[i].symbol_pair);
      let open_sell_orders = await database("transactions")
        .where({
          transaction_type: "sell",
          fulfilled: false,
          order_status: "CREATED"
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
            (action1 === "sell" || action2 === "sell") &&
            sell_list[i].transaction_id !== open_sell_orders[j].selling_pair_id
          ) {
            action = "sell";
            await update_sell_orders(sell_list[i], action);
          }
        }
      } else {
        if (action1 === "sell" || action2 === "sell") {
          action = "sell";
          await update_sell_orders(sell_list[i], action);
        }
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

setInterval(async function call() {
  await createSellOrder();
}, 30000);

module.exports = {
  sellModel1,
  sellModel2,
  update_sell_orders,
  createSellOrder
};
