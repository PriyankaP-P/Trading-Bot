

let data = ['ADA/ETH','BCH/ETH','ELF/ETH','EOS/ETH'];
 

// for(let i=0;i<data.length ;i++){
//     console.log(data[i]);
// }

let d2 =['ELF/ETH','EOS/ETH'];

data = data.filter(item => d2.every(item2 => item2 !== item));


console.log(data);













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