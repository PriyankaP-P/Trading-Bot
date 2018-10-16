"use strict";

const database = require("./knexfile");
const fs = require("fs");
const date = new Date();

async function open_symbols(list) {
  let recently_traded_coins = [];
  let open_unfulfilled_trades = [];
  let list_of_coins_to_scan_excluding_recent_trades = [];

  let unfulfilled_trades = await database("transactions")
    .where({ order_status: "CREATED" })
    .select("symbol_pair")
    .then(row => row)
    .catch(err => console.log(err));

  let past_trades = await database("transactions")
    .where({
      transaction_type: "buy",
      fulfilled: "t"
    })
    .select("symbol_pair", "trade_date")
    .then(row => row)
    .catch(err => console.log(err));

  console.log(past_trades);
  for (let i = 0; i < past_trades.length; i++) {
    let buy_time = past_trades[i].trade_date;
    let time_passed_since_last_trade =
      (Date.now() - buy_time) / (60 * 60 * 1000);

    console.log(time_passed_since_last_trade);
    if (time_passed_since_last_trade <= 24) {
      recently_traded_coins.push(past_trades[i].symbol_pair);
      console.log(
        `Timed out coins = ${
          past_trades[i].symbol_pair
        }, please wait 24 hours before purchase`
      );
    }
  }
  console.log(recently_traded_coins);
  for (let j = 0; j < unfulfilled_trades.length; j++) {
    open_unfulfilled_trades.push(unfulfilled_trades[j].symbol_pair);
  }
  let removal_list = recently_traded_coins.concat(open_unfulfilled_trades);
  console.log(`removal_list`);
  console.log(removal_list);
  fs.appendFile(
    "log.txt",
    `${date} removal_list = ${removal_list} \n`,
    error => {
      if (error) throw error;
    }
  );
  let duplicates_removed_from_recently_traded_coins = removal_list.filter(
    function(elem, pos) {
      return removal_list.indexOf(elem) == pos;
    }
  );
  console.log(
    `duplicates_removed_from_recently_traded_coins = ${duplicates_removed_from_recently_traded_coins}`
  );
  fs.appendFile(
    "log.txt",
    `${date} duplicates_removed_from_recently_traded_coins =  ${duplicates_removed_from_recently_traded_coins} \n`,
    error => {
      if (error) throw error;
    }
  );
  list_of_coins_to_scan_excluding_recent_trades = list.filter(item =>
    duplicates_removed_from_recently_traded_coins.every(item2 => item2 !== item)
  );
  console.log(
    `list_of_coins_to_scan_excluding_recent_trades =  ${list_of_coins_to_scan_excluding_recent_trades}`
  );
  fs.appendFile(
    "log.txt",
    `${date} list_of_coins_to_scan_excluding_recent_trades =  ${list_of_coins_to_scan_excluding_recent_trades} \n`,
    error => {
      if (error) throw error;
    }
  );

  return list_of_coins_to_scan_excluding_recent_trades;
}

module.exports = {
  open_symbols
};
