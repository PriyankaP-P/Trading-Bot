"use strict";

const ccxt = require('ccxt');
const exchange = new ccxt['binance']();


async function symbolsUsed(base_currency, daily_cutoff_vol){
    
    const response = await exchange.fetchTickers();  
    const symbols =await exchange.symbols;
    const local_response = response;
    const symbol_used = symbols;
    // let base_currency = '/BTC';
    // let daily_cutoff_vol = 700;
    let btc_arr =[];

    for(let i=0; i<symbol_used.length; i++){
        if((local_response[symbol_used[i]].quoteVolume >= daily_cutoff_vol) &&
         (symbol_used[i].includes( base_currency))) {
            
            btc_arr.push(symbol_used[i]); 
        }
    }
    return btc_arr;
}

module.exports ={
    symbolsUsed
};
