"use strict";
const fs =require('fs');
const date = new Date();
const ccxt = require('ccxt');
const exchange = new ccxt['binance']({
    'options': {
        'adjustForTimeDifference': true,
        'verbose': true,
        'recvWindow': 10000000
    }
});


async function symbolsUsed(base_currency, daily_cutoff_vol){
    
    const response = await exchange.fetchTickers();  
    const symbols =await exchange.symbols;
    const local_response = response;
    const symbol_used = symbols;
  
    let btc_arr =[];

    for(let i=0; i<symbol_used.length; i++){
        if((local_response[symbol_used[i]].quoteVolume >= daily_cutoff_vol) &&
         (symbol_used[i].includes( base_currency))) {
            
            btc_arr.push(symbol_used[i]); 
        }
    }
        
    fs.appendFile(
        "log.txt",
        `${date} coins scanned for volume limit =  ${btc_arr} \n`,
        error => {
            if(error) throw error;
        } 
    );    
    
    return btc_arr;
}

module.exports ={
    symbolsUsed
};
