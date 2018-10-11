const database = require("./knexfile");

async function past_trades() {
  try {
    let list_old_trades = await database("transactions")
      .where({
        transaction_type: "sell",
        position_status: "old"
      })
      .select()
      .then(row => row)
      .catch(error => console.log(error));

    for (let i = 0; i < list_old_trades.length; i++) {
      let buy_pair = await database("transactions")
        .where("transaction_id", list_old_trades[i].selling_pair_id)
        .select()
        .then(row => row)
        .catch(error => console.log(error));

      let percent_change_per_unit =
        ((list_old_trades[i].price_base_currency -
          buy_pair[0].price_base_currency) /
          buy_pair[0].price_base_currency) *
        100;

      let costBasis = buy_pair[0].price_base_currency * buy_pair[0].quantity;
      let totalProceedsOfSale =
        list_old_trades[i].price_base_currency * list_old_trades[i].quantity;
      let base_currency_change = totalProceedsOfSale - costBasis;

      let existing_entries = await database("revenue")
        .select("selling_pair_id")
        .then(row => row)
        .catch(error => console.log(error));
      if (existing_entries.length > 0) {
        for (let j = 0; j < existing_entries.length; j++) {
          if (
            list_old_trades[i].selling_pair_id !==
            existing_entries[j].selling_pair_id
          ) {
            await database("revenue")
              .insert({
                symbol_pair: buy_pair[0].symbol_pair,
                selling_pair_id: list_old_trades[i].selling_pair_id,
                buying_price: buy_pair[0].price_base_currency,
                quantity_bought: buy_pair[0].quantity,
                selling_price: list_old_trades[i].price_base_currency,
                quantity_sold: list_old_trades[i].quantity,
                perunit_gain_loss: percent_change_per_unit,
                base_currency_change: base_currency_change
              })
              .then(row => row)
              .catch(error => console.log(error));
          }
        }
      } else {
        await database("revenue")
          .insert({
            symbol_pair: buy_pair[0].symbol_pair,
            selling_pair_id: list_old_trades[i].selling_pair_id,
            buying_price: buy_pair[0].price_base_currency,
            quantity_bought: buy_pair[0].quantity,
            selling_price: list_old_trades[i].price_base_currency,
            quantity_sold: list_old_trades[i].quantity,
            perunit_gain_loss: percent_change_per_unit,
            base_currency_change: base_currency_change
          })
          .then(row => row)
          .catch(error => console.log(error));
      }
    }
  } catch (e) {
    console.log(e);
  }
}

setInterval(async function rev_percent() {
  try {
    await past_trades();
    console.log("Revenue table updated");
  } catch (error) {
    console.log(error);
  }
}, 180000);
