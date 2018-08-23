"use strict";

const ccxt = require ('ccxt');

async function account_balance(standard_trade_currency) {
    let binance = new ccxt.binance({
        'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
        'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4'
    })
    // const standard_trade_currency = 'BTC';
    // const trade_amt= 0.01;
    
  
 
    let balance = await binance.fetchBalance ();
    const account =[];
    
    for(let i=0; i<balance.info.balances.length; i++){
        account.push(balance.info.balances[i]);
    }
    let trade_balance = account.filter(each => each.asset === standard_trade_currency);
    
    let base_balance =trade_balance[0].free ;
    
    console.log(base_balance);
    
    return base_balance;    
    
}


module.exports= {
    account_balance
};


