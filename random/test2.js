const database = require("../knexfile");
const date = new Date();

//   database('transactions').insert({trade_date: date, symbol_pair: 'BNB/BTC',
//                             price_base_currency: 0.00149060, equivalent_amt_base_currency: 0.005000000,
//                             transaction_type: 'buy', fulfilled: 't', order_status: 'closed',
//                             exchange_client_id: '63047189', exchange_timestamp: '1536359093097',
//                             position_status: 'new'
//                         })
//                         .then(function(row){
//                         console.log(row);
//                     }).catch(function(err){
//                         console.log(err);
//                     })

// database('transactions').update()
database("transactions")
  .update({
    fulfilled: "t",
    order_status: "closed",
    exchange_client_id: "18599619",
    exchange_timestamp: "1537992138800",
    position_status: "new"
  })
  .where("transaction_id", "ea65115b-a46e-48ac-91cb-579d7a166d21")

  .then(function(row) {
    console.log(row);
  })
  .catch(function(err) {
    console.log(err);
  });
// where('transaction_id', '7cba3de4-9e42-4f23-8b81-2b70e15e1201')
//, selling_pair_id: '87e172c9-2b27-4ca7-987d-2449db219a3e'

// let data = {id: 233, symbol: 'EOS/BTC', uid: 'hgfdgjui7898hjko5668' }
// let data1 = {id: 234, symbol: 'LTC/BTC', uid: 'hgfdgjui78984r4tfddhjko5668' }
// let arr =[data, data1];
// // console.log(arr);
// let a =[];
// for(let i=0; i<arr.length ;i++){
//     a.push(arr[i]);
// }

// // console.log(a);
// console.log(a[0]);

// let data = ['ADA/ETH','BCH/ETH','ADA/ETH','ELF/ETH','EOS/ETH', 'ADA/ETH'];

// // for(let i=0;i<data.length ;i++){
// //     console.log(data[i]);
// // }

// // let d2 =['ELF/ETH'];
// console.log(data.filter(function(elem, pos){
//     return data.indexOf(elem) == pos;
// }));

// console.log(data);

// "use strict";

// const ccxt = require('ccxt');
// const exchange = new ccxt['binance']();

// (async function get_all(){
//     const dict = await exchange.fetchMarkets();

//     console.log(dict);
// })();

// // (async () => {
// //     let pairs = await exchange.publicGetSymbolsDetails ()
// //     let marketIds = Object.keys (pairs['result'])
// //     let marketId = marketIds[0]
// //     let ticker = await exchange.publicGetTicker ({ pair: marketId })
// //     console.log (exchange.id, marketId, ticker)
// // }) ();
