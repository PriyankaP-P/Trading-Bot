
const database = require('./knexfile'); 
const date = new Date();

  database('transactions').where('transaction_id', '38ee4fd3-5aec-4d56-88c3-7867bff733ee')
                        .update({'exchange_client_id': null,
                                'exchange_timestamp': null,
                                'order_status': 'open',
                            'fulfilled': false})
                        .then(function(row){
                        console.log(row);
                    }).catch(function(err){
                        console.log(err);
                    })



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