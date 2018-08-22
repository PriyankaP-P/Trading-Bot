"use strict";

const trade = require('./trade');
const long = require('./long');


setInterval(async function app(){
    try{
        const interval = '15m';
        let base_currency = '/ETH';
        let daily_cutoff_vol = 1000;
        await trade.call_trade_symbol(interval, base_currency, daily_cutoff_vol);
        
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
