"use strict";

const trade = require('./trade');
// const long = require('./long');
const isEqual = require('./isEqual');
const markets = require('./markets');
const orders = require('./orders');

setInterval(async function app(){
    try{
        const interval = '15m';
        let base_currency = '/BTC';
        let daily_cutoff_vol = 1000;
        let local_symbols = await markets.symbolsUsed(base_currency, daily_cutoff_vol);
        let arr_to_scan = await orders.open_symbols(local_symbols);
        let isEqual_result = await isEqual.arr_list(arr_to_scan, interval);
        await trade.call_trade_symbol(isEqual_result);
                
        console.log("scan app works");
    }catch(e){
        console.log(e);
    }
    
}, 50000);


// setInterval(async function sale_app(){
//     try{
//         const interval = '15m';
        
//         await long.long_positions(interval);
//         console.log("sale app works");
//     }catch(e){
//         console.log(e);
//     }
    
// }, 20000);
