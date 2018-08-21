"use strict";

const ccxt = require('ccxt');
const exchange = new ccxt['binance']();


async function symbolsUsed(){
    
    const response = await exchange.fetchTickers();  
    const symbols =await exchange.symbols;
    const local_response = response;
    const symbol_used = symbols;

    let btc_arr =[];

    for(let i=0; i<symbol_used.length; i++){
        if((local_response[symbol_used[i]].quoteVolume >=500) &&
         (symbol_used[i].includes('/BTC'))) {
            
            btc_arr.push(symbol_used[i]); 
        }
    }
    return btc_arr;
}

module.exports ={
    symbolsUsed
};
