"use strict";

// const database = require('./knexfile'); 
const tickers = require('./tickers');
const date= new Date();
// const limitOrder = require('./limitOrder');
const isEqual = require('./isEqual');


// async function loop(data){
//     for(let i; i< data.length; i++){
//         console.log(data[i] + "i =")
//     }
// }









(async function call_trade_symbol(){
    const interval = '15m';
    let call_arr = await isEqual.arr_list(interval);
    
    console.log(call_arr);

})();