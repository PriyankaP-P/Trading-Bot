"use strict";

const exchanges = require("./exchanges");

async function coin_list(base_currency, daily_cutoff_vol) {
  try {
    const response = await exchanges.fetchTickers();
    const symbols = await exchanges.symbols;
    const local_response = response;
    const symbol_used = symbols;

    let base_coins = [];

    for (let i = 0; i < symbol_used.length; i++) {
      if (
        local_response[symbol_used[i]].quoteVolume >= daily_cutoff_vol &&
        symbol_used[i].includes(base_currency)
      ) {
        base_coins.push(symbol_used[i]);
      }
    }
    return base_coins;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log(exchanges.last_http_response);
    console.log("Failed");
  }
}

module.exports = {
  coin_list
};
