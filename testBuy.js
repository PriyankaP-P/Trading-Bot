"use strict";

const exchanges = require("./exchanges");
const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

function calculateEma(ohlcv, period) {
  try {
    const close_price_index = 4;
    let ema = [];
    let arr = [];
    let prec;
    let multiplier = 2 / (period + 1);

    for (let count = 0; count < period; count++) {
      arr.push(ohlcv[count][close_price_index]);
    }

    let sma_arr = arr.slice(0, period - 1);
    let sum = sma_arr.reduce((total, sma) => total + sma, 0);
    let sma1 = sum / period;
    ema.push(sma1);

    for (let i = 1; i < ohlcv.length; i++) {
      let calc =
        multiplier * (ohlcv[i][close_price_index] - ema[i - 1]) + ema[i - 1];

      if (ohlcv[i][close_price_index] < 0.00009) {
        prec = 11;
      } else {
        prec = 8;
      }
      let result = Math.round(calc * Math.pow(10, prec)) / Math.pow(10, prec);
      ema.push(result);
    }
    // console.log(`ema 1= ${ema}`);
    return ema;
  } catch (error) {
    console.log(error + "--Failed at ema func");

    console.log(error.constructor.name, error.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function percent(value, basis_value) {
  try {
    let cal = ((value - basis_value) / basis_value) * 100;
    let round_off_4 = Math.round(cal * Math.pow(10, 4)) / Math.pow(10, 4);
    return round_off_4;
  } catch (e) {
    console.log(e);
  }
}

async function watchEma(scannedCoins, interval) {
  try {
    // console.log(`Scanned coins from watchEma= ${scannedCoins}`);
    for (let j = 0; j < scannedCoins.length; j++) {
      fs.appendFile(
        "emaThink.txt",
        `${date} entry for coin ${
          scannedCoins[j]
        }, from think file interval= ${interval}\n`,
        error => {
          if (error) throw error;
        }
      );
      let time = [];
      const ohlcv = await exchanges.fetchOHLCV(scannedCoins[j], interval);
      // console.log(`coin = ${scannedCoins[j]}ohlcv length =${ohlcv.length}`);
      if (ohlcv.length === 500) {
        for (let t = 0; t < ohlcv.length; t++) {
          let temp = ohlcv[t][0];
          time.push(temp);
        }
        let recentFirstTime = time.reverse();

        let ema55 = await calculateEma(ohlcv, 55);
        let ema55_reverse = ema55.reverse();

        let ema21 = await calculateEma(ohlcv, 21);
        let ema21_reverse = ema21.reverse();

        let ema13 = await calculateEma(ohlcv, 13);
        let ema13_reverse = ema13.reverse();

        let ema8 = await calculateEma(ohlcv, 8);
        let ema8_reverse = ema8.reverse();
        for (let i = 1; i < 9; i++) {
          let percent21_55 = await percent(ema21_reverse[i], ema55_reverse[i]);
          let percent13_55 = await percent(ema13_reverse[i], ema55_reverse[i]);
          let percent8_55 = await percent(ema8_reverse[i], ema55_reverse[i]);
          let time = Date.now();
          let db_entry = await database("marketema")
            .insert({
              symbol_pair: scannedCoins[j],
              entry_time: time,
              exchange_time: recentFirstTime[i],
              interval: interval,
              ema55_last_100: ema55_reverse[i],
              ema21_last_100: ema21_reverse[i],
              ema13_last_100: ema13_reverse[i],
              ema8_last_100: ema8_reverse[i],
              percent_diff_21_55: percent21_55,
              percent_diff_13_55: percent13_55,
              percent_diff_8_55: percent8_55
            })
            .then(row => row)
            .catch(error => console.log(error));
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

async function model1(tradePairs) {
  try {
    const prospectiveBuys = [];
    let closePairs;
    console.log(tradePairs.length);
    for (let i = 0; i < tradePairs.length; i++) {
      closePairs = await database("marketema")
        .groupBy("marketema.id")
        .orderBy("entry_time", "desc") //most recent entry has position =0
        .having("symbol_pair", "=", tradePairs[i])
        .limit(8)
        .then(row => row)
        .catch(error => console.log(error));

      //   console.log(closePairs);
      let startPosition = -1;
      let count = 0;
      let occurances = 0;
      for (let j = 0; j < closePairs.length; j++) {
        if (
          closePairs[j].percent_diff_21_55 < 0 &&
          closePairs[j].percent_diff_13_55 < 0 &&
          closePairs[j].percent_diff_8_55 < 0
        ) {
          startPosition = j;
        } else {
          startPosition = -1;
        }
        occurances = 0;
        while (startPosition !== -1 && startPosition < closePairs.length) {
          if (
            closePairs[startPosition].percent_diff_21_55 < 0 &&
            closePairs[startPosition].percent_diff_13_55 < 0 &&
            closePairs[startPosition].percent_diff_8_55 < 0
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

      let buyPosition = -1;

      if (occurances >= 6) {
        let endOfNegative = occurances;

        for (
          let trailCount = endOfNegative;
          trailCount < closePairs.length;
          trailCount++
        ) {
          if (
            closePairs[trailCount].percent_diff_21_55 < 0 &&
            closePairs[trailCount].percent_diff_13_55 > 0 &&
            closePairs[trailCount].percent_diff_8_55 > 0
          ) {
            buyPosition = trailCount;
            break;
          }
        }

        if (buyPosition !== -1) {
          prospectiveBuys.push([
            closePairs[buyPosition].id,
            closePairs[buyPosition].symbol_pair,
            closePairs[buyPosition].exchange_time
          ]);
          console.log(
            `buy ${closePairs[buyPosition].symbol_pair} at position id = ${
              closePairs[buyPosition].id
            }, exchange timestamp = ${closePairs[buyPosition].exchange_time}`
          );
        }
      }
    }
    fs.appendFile(
      "buyLogs.txt",
      `date = ${date},  prospective buys= ${prospectiveBuys} \n`,
      error => {
        if (error) throw error;
      }
    );
    return prospectiveBuys;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function model2(tradePairs) {
  try {
    const buys_model2 = [];
    let closePairs;
    console.log(tradePairs.length);
    for (let i = 0; i < tradePairs.length; i++) {
      closePairs = await database("marketema")
        .groupBy("marketema.id")
        .orderBy("entry_time", "desc") //most recent entry has position =0
        .having("symbol_pair", "=", tradePairs[i])
        .limit(8)
        .then(row => row)
        .catch(error => console.log(error));
      let startPosition = -1;
      let count = 0;
      let occurances = 0;
      for (let j = 0; j < closePairs.length; j++) {
        if (
          closePairs[j].percent_diff_21_55 < 0 &&
          closePairs[j].percent_diff_13_55 < 0 &&
          closePairs[j].percent_diff_8_55 < 0
        ) {
          startPosition = j;
        } else {
          startPosition = -1;
        }
        occurances = 0;
        while (startPosition !== -1 && startPosition < closePairs.length) {
          if (
            closePairs[startPosition].percent_diff_21_55 < 0 &&
            closePairs[startPosition].percent_diff_13_55 < 0 &&
            closePairs[startPosition].percent_diff_8_55 < 0
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

      let buyPosition = -1;

      if (occurances >= 6) {
        let endOfNegative = occurances;

        for (
          let trailCount = endOfNegative;
          trailCount < closePairs.length;
          trailCount++
        ) {
          if (
            closePairs[trailCount].percent_diff_21_55 > 0 &&
            closePairs[trailCount].percent_diff_13_55 > 0 &&
            closePairs[trailCount].percent_diff_8_55 > 0
          ) {
            buyPosition = trailCount;
            break;
          }
        }

        if (buyPosition !== -1) {
          buys_model2.push([
            closePairs[buyPosition].id,
            closePairs[buyPosition].symbol_pair,
            closePairs[buyPosition].exchange_time
          ]);
          console.log(
            `buy ${closePairs[buyPosition].symbol_pair} at position id = ${
              closePairs[buyPosition].id
            }, exchange timestamp = ${closePairs[buyPosition].exchange_time}`
          );
        }
      }
    }
    fs.appendFile(
      "buyLogs.txt",
      `date = ${date}, buys model2 = ${buys_model2} \n`,
      error => {
        if (error) throw error;
      }
    );
    return buys_model2;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

async function model3(tradePairs) {
  try {
    const buys_model3 = [];
    let closePairs;
    console.log(tradePairs.length);
    for (let i = 0; i < tradePairs.length; i++) {
      // console.log(tradePairs[i], " i= " + i);
      closePairs = await database("marketema")
        .groupBy("marketema.id")
        .orderBy("entry_time", "desc") //most recent entry has position =0
        .having("symbol_pair", "=", tradePairs[i])
        .limit(8)
        .then(row => row)
        .catch(error => console.log(error));
      for (let j = 4; j < closePairs.length - 2; j++) {
        if (
          closePairs[j].percent_diff_21_55 === 0 &&
          (closePairs[j + 2].percent_diff_8_55 > 0.1 &&
            closePairs[j + 2].percent_diff_13_55 > 0.1)
        ) {
          buys_model3.push([
            closePairs[j + 2].id,
            closePairs[j + 2].symbol_pair,
            closePairs[j + 2].exchange_time
          ]);
        }
      }
    }
    fs.appendFile(
      "buyLogs.txt",
      `date = ${date}, buys model3 = ${buys_model3} \n`,
      error => {
        if (error) throw error;
      }
    );
    return buys_model3;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed");
  }
}

module.exports = {
  calculateEma,
  percent,
  watchEma,
  model1,
  model2,
  model3
};
