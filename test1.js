"use strict";

const date = new Date();
const fs = require("fs");
const database = require("./knexfile");

(async function sellModel1() {
  await database("transactions")
    .where({ transaction_id: "d26eff9b-35b1-4842-a739-0c47a52c4718" })
    .delete()
    .then(row => row)
    .catch(error => console.log(error));
})();
