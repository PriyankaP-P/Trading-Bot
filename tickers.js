"use strict";

const ccxt = require ('ccxt');


async function tics(symbol, action){
    
    const exchange = new ccxt['binance']({
        enableRateLimit: true
    });
    //const symbol = 'ONT/BTC';

    
    const ticker =await exchange.fetchTicker(symbol);
    let bid = ticker['bid'];
    let ask = ticker['ask'];
    let result;
   
    if(action === "bid"){
        result = bid;// - (bid*0.20)   ,bid - (bid*0.00001)  enter bid price at 0.1% lower than current bid if code was faster
        
    } else if(action === "ask"){
        result = ask ;//+ (ask*0.20) 
        
    } else {
        result =  undefined;
    }
    
    return result;
}

module.exports = {
    tics
};
