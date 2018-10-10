"use strict";

const ccxt = require ('ccxt');


async function tics(symbol, action){
    
    const exchange = new ccxt['binance']({
        enableRateLimit: true,
        'options': {
            'adjustForTimeDifference': true,
            'verbose': true,
            'recvWindow': 10000000
        }
    });
    //const symbol = 'ONT/BTC';

    
    const ticker =await exchange.fetchTicker(symbol);
    let bid = ticker['bid'];
    let ask = ticker['ask'];
    let result;
   
    if(action === "bid"){
        result = bid- (bid*0.0002);//  enter bid price at 0.02% lower than current bid if code was faster
        
    } else if(action === "ask"){
        result = ask+ (ask*0.0002); 
        
    } else {
        result =  undefined;
    }
    
    return result;
}

module.exports = {
    tics
};
