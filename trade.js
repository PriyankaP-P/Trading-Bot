"use strict";

// const database = require('./knexfile'); 
// const tickers = require('./tickers');
// const date= new Date();
// const limitOrder = require('./limitOrder');
const isEqual = require('./isEqual');

// async function new_trade(){
//     let ticPrice =await tickers.tics(symbol, action);
//     let price = ticPrice;
// }


(async function call_trade_symbol_loop(){
    let call_arr = await emaStatus.tradeStatus();
    console.log(call_arr);

})();