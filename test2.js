

const data = [ [ 'ADA/ETH', 'bid' ],
[ 'BCH/ETH', 'bid' ],
[ 'ELF/ETH', 'ask' ],
[ 'EOS/ETH', 'bid' ],
[ 'GTO/ETH', 'bid' ],
[ 'LOOM/ETH', 'ask' ],
[ 'NEO/ETH', 'ask' ],
[ 'NPXS/ETH', 'bid' ],
[ 'WAN/ETH', 'ask' ] ];


console.log(data[0][0]);



















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