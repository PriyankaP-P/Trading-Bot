"use strict";
const markets = require("./markets");
const database = require("./knexfile");
const testBuy = require("./testBuy");
const date = new Date();
const fs = require("fs");
const orders = require("./orders");
// const limitOrder = require("./limitOrder");
const utility = require("./utility");
const stoploss = require("./stoploss");
const earnings = require("./earnings");

const interval = "4h";
let trading_strategy = "ema";
let standard_trade_currency = "BTC";
let database_vol = 0;
let user_cutoff_volume = 100;
const base_currency = "/" + standard_trade_currency;
const tradeAmt = 0.003;
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

      fs.writeFile(
        "log.txt",
        "----------Ema processing logs----------\n \n \n",
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
    console.log("Failed 1");
  }
})();

async function scanApp() {
  try {
    const scannedCoins = await markets.coin_list(base_currency, database_vol);
    console.log(`coins entered into database = ${scannedCoins}`);
    fs.appendFile(
      "emaThink.txt",
      `${Date.now()} coins entered into databaselist (new)= ${scannedCoins} at interval= ${interval}\n`, //update time regularly
      error => {
        if (error) throw error;
      }
    );
    await testBuy.watchEma(scannedCoins, interval);
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed 2");
  }
}

setInterval(async function call() {
  try {
    fs.appendFile("emaThink.txt", `${Date.now()}  \n`, error => {
      if (error) throw error;
    });
    await scanApp();
  } catch (e) {
    console.log(e);
  }
}, 120000);

setInterval(async function call_all() {
  try {
    await stoploss.cut_loss(stop_loss_percent);
  } catch (e) {
    console.log(e);
  }
}, 2000);

setInterval(async function() {
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
    console.log(`coinsWithVolumeCuttoff by user = ${coinsWithVolumeCuttoff}`);

    let tradePairs = await orders.open_symbols(coinsWithVolumeCuttoff);
    await database("possibletrades")
      .insert({
        entry_time: Date.now(),
        coins: tradePairs
      })
      .then(row => row)
      .catch(err => console.log(err));
  } else {
    console.log("Waiting for database to acquire Ema history.............");
  }
}, 20000);
