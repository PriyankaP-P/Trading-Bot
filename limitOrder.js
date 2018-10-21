"use strict";

const database = require("./knexfile");
const balance = require("./checkBalance");
const binance = require("./personalApi");
const exchanges = require("./exchanges");

async function makeOrder(symbol, side, amount, price) {
  const orderType = "limit";

  try {
    let response = await binance.createOrder(
      symbol,
      orderType,
      side,
      amount,
      price
    );
    console.log(response);
    return response;
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed limit order -1");
  }
}

async function placeOrders() {
  try {
    let amount;
    let order_list = await database("transactions")
      .where({
        fulfilled: false,
        order_status: "CREATED"
      })
      .whereNull("exchange_client_id")
      .select()
      .then(function(rows) {
        return rows;
      })
      .catch(function(error) {
        console.log(error);
      });

    for (let i = 0; i < order_list.length; i++) {
      let transactionId = order_list[i].transaction_id;
      let symbol = order_list[i].symbol_pair;
      let side = order_list[i].transaction_type;
      let price = order_list[i].price_base_currency;
      if (side === "sell") {
        let coin = symbol.split("/");
        amount = await balance.account_balance(coin[0]); // correct to only amount used in particular trade, subtract exchange fees
      } else if (side === "buy") {
        amount = order_list[i].quantity;
      }

      let sending_orders = await makeOrder(symbol, side, amount, price);
      let order_info = await database("transactions")
        .where("transaction_id", transactionId)
        .update({
          exchange_client_id: sending_orders["id"],
          exchange_timestamp: sending_orders["timestamp"]
        })
        .then(function(rows) {
          return rows;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed 11");
  }
}

async function order_status() {
  try {
    let open_orders_array = await database("transactions")
      .where("order_status", "CREATED")
      .orWhere("order_status", "PARTIALLY_FILLED")
      .whereNotNull("exchange_client_id")
      .select("transaction_id", "symbol_pair", "exchange_client_id")
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    for (let i = 0; i < open_orders_array.length; i++) {
      let id = open_orders_array[i].exchange_client_id;
      let symbol = open_orders_array[i].symbol_pair;
      let result = await binance.fetchOrder(id, symbol);

      if (result.info.status === "CANCELED") {
        let update_order = await database("transactions")
          .where("transaction_id", open_orders_array[i].transaction_id)
          .update("order_status", result.info.status)
          .then(function(row) {
            return row;
          })
          .catch(function(err) {
            console.log(err);
          });
      } else if (result.info.status === "FILLED") {
        let update_order = await database("transactions")
          .where("transaction_id", open_orders_array[i].transaction_id)
          .update({
            order_status: result.info.status,
            fulfilled: true,
            position_status: "new"
          })
          .then(function(row) {
            return row;
          })
          .catch(function(err) {
            console.log(err);
          });
      } else if (result.info.status === "PARTIALLY_FILLED") {
        let update_order = await database("transactions")
          .where("transaction_id", open_orders_array[i].transaction_id)
          .update({
            order_status: result.info.status,
            fulfilled: false
          })
          .then(function(row) {
            return row;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed 12");
  }
}

async function cancel_orders() {
  try {
    let cancel_list = await database("transactions")
      .where("order_status", "CREATED")
      .whereNotNull("exchange_client_id")
      .select(
        "transaction_id",
        "symbol_pair",
        "exchange_client_id",
        "exchange_timestamp"
      )
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    for (let i = 0; i < cancel_list.length; i++) {
      let id = cancel_list[i].exchange_client_id;
      let symbol = cancel_list[i].symbol_pair;

      if (
        exchanges.nonce() >=
        parseInt(cancel_list[i].exchange_timestamp) + 180 * 1000
      ) {
        let terminate = binance.cancelOrder(id, symbol);

        console.log(terminate);
        console.log(`order id = ${id} cancelled`);
      }
    }
  } catch (err) {
    console.log("--------------------------");
    console.log(err.constructor.name, err.message);
    console.log("--------------------------");
    console.log("Failed 13");
  }
}

async function monitor_position_status() {
  try {
    database("transactions")
      .where({
        transaction_type: "sell",
        fulfilled: true,
        order_status: "FILLED",
        position_status: "new"
      })
      .whereNotNull("exchange_client_id")
      .update("position_status", "old")
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    let list_old_transactions = await database("transactions")
      .where({
        transaction_type: "sell",
        fulfilled: true,
        order_status: "FILLED",
        position_status: "old"
      })
      .whereNotNull("selling_pair_id")
      .select("selling_pair_id")
      .then(function(row) {
        return row;
      })
      .catch(function(err) {
        console.log(err);
      });

    for (let i = 0; i < list_old_transactions.length; i++) {
      database("transactions")
        .where("transaction_id", list_old_transactions[i].selling_pair_id)
        .update("position_status", "old")
        .then(function(row) {
          return row;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  } catch (e) {
    console.log(exchanges.iso8601(Date.now()), e.constructor.name, e.message);
    console.log("Failed 15");
  }
}

setInterval(async function call() {
  await placeOrders();
  await order_status();
  await cancel_orders();
  await monitor_position_status();
}, 2000);

module.exports = {
  makeOrder,
  placeOrders,
  order_status
};
