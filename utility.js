"use strict";

const date = new Date();
const database = require("./knexfile");

setInterval(async function clean_Db_marketema() {
  let time = Date.now() - 2 * 60 * 60000;
  console.log(time);
  await database("marketema")
    .where("entry_time", "<", time)
    .delete()
    .then(row => row)
    .catch(error => console.log(error));

  await database("possibletrades")
    .where("entry_time", "<", time)
    .delete()
    .then(row => row)
    .catch(error => console.log(error));
}, 120000);

setInterval(async function purge_db() {
  try {
    let clear_list = await database("transactions")
      .where({
        fulfilled: false,
        order_status: "CREATED"
      })
      .whereNull("exchange_client_id")
      .select("transaction_id", "trade_date")
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    for (let i = 0; i < clear_list.length; i++) {
      let temp = clear_list[i].trade_date;
      let elapsedTime = temp + 3 * 60 * 1000;
      if (temp <= elapsedTime) {
        await database("transactions")
          .where("transaction_id", clear_list[i].transaction_id)
          .del()
          .then(function(row) {
            return row;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  } catch (e) {
    console.log(exchange.iso8601(Date.now()), e.constructor.name, e.message);
    console.log("Failed 16");
  }
}, 120000);
