"use strict";
const markets = require("./markets");
const database = require("./knexfile");
const testBuy = require("./testBuy");
const date = new Date();
const fs = require("fs");
const orders = require("./orders");
const balance = require("./checkBalance");
const trade = require("./trade");
// const testSell = require("./testSell");
const limitOrder = require("./limitOrder");
const utility = require("./utility");
const stoploss = require("./stoploss");
const trailing_stop = require("./trailing-stop");
const earnings = require("./earnings");

const interval = "1h";
let trading_strategy = "ema";
let standard_trade_currency = "BTC";
let database_vol = 0;
let user_cutoff_volume = 10;
const base_currency = "/" + standard_trade_currency;
const tradeAmt = 0.005;
const stop_loss_percent = 1;

(async function bitomic() {
  try {
    if (trading_strategy === "ema") {
      fs.writeFile(
        "emaThink.txt",
        "----------Ema processing logs----------\n \n \n",
        error => {
          if (error) throw err;
        }
      );
      fs.writeFile(
        "buyLogs.txt",
        "----------Processing prospective buy logs----------\n \n \n",
        error => {
          if (error) throw err;
        }
      );

      fs.writeFile(
        "sellLogs.txt",
        "----------Processing prospective sell logs----------\n \n \n",
        error => {
          if (error) throw err;
        }
      );
    }
    await scanApp();
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
})();

async function scanApp() {
  try {
    const scannedCoins = await markets.coin_list(base_currency, database_vol);
    fs.appendFile(
      "emaThink.txt",
      `${date} scanned coin list (new)= ${scannedCoins} at interval= ${interval}\n`, //update time regularly
      error => {
        if (error) throw error;
      }
    );
    await testBuy.watchEma(scannedCoins, interval);
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

setInterval(async function call() {
  try {
    fs.appendFile("emaThink.txt", `${date}  \n`, error => {
      if (error) throw error;
    });
    await scanApp();
  } catch (e) {
    console.log(e);
  }
}, 120000);

Array.prototype.uniq = function() {
  let res = this.concat();
  for (let i = 0; i < res.length; i++) {
    let compare = res[i][1];
    let ct = res[i][2];

    for (let j = i + 1; j < res.length; j++) {
      if (compare == res[j][1]) {
        if (ct) {
          res.splice(j--, 1);
        }
      }
    }
  }
  return res;
};

setInterval(async function() {
  let buyList = [];
  let finalBuyList = [];
  let tradingPairs = [];

  let checkDatabaseUpdated = await database("marketema")
    .count("id")
    .then(row => row)
    .catch(error => console.log(error));

  console.log(`Current database entries = ${checkDatabaseUpdated[0].count}`);
  if (checkDatabaseUpdated[0].count >= 2368) {
    let coinsWithVolumeCuttoff = await markets.coin_list(
      base_currency,
      user_cutoff_volume
    );
    // console.log(coinsWithVolumeCuttoff);

    let tradePairs = await orders.open_symbols(coinsWithVolumeCuttoff);
    let run = await testBuy.model1(tradePairs);

    console.log(run);
    let run2 = await testBuy.model2(tradePairs);
    console.log(`run2 = \n`);
    console.log(run2);

    let run3 = await testBuy.model3(tradePairs);
    console.log(`run3 = \n`);
    console.log(run3);

    buyList = run.concat(run2).uniq();
    finalBuyList = buyList.concat(run3).uniq();
    // console.log(finalBuyList);

    for (let j = 0; j < finalBuyList.length; j++) {
      tradingPairs.push(finalBuyList[j][1]);
    }
    console.log(tradingPairs);
    let available_balance = await balance.account_balance(
      standard_trade_currency
    );
    let processTrades = await trade.call_trade_symbol(
      tradingPairs,
      available_balance,
      tradeAmt
    );

    fs.appendFile(
      "buyLogs.txt",
      `date = ${date},  result = ${finalBuyList} \n`,
      error => {
        if (error) throw error;
      }
    );

    await stoploss.cut_loss(stop_loss_percent);
  } else {
    console.log("Waiting for database to acquire Ema history.............");
  }
}, 30000);
