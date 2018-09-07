"use strict";

const ccxt = require ('ccxt');

let binance = new ccxt.binance({
    'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
    'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4',
    'options': {
        'adjustForTimeDifference': true,
        'verbose': true,
        'recvWindow': 10000000
    }        
});



async function account_balance(symbol) {
    let balance = await binance.fetchBalance ();
    let trade_balance = balance.info.balances.filter(each => each.asset === symbol);
    let base_balance =trade_balance[0].free; 
    return base_balance;    
    
}


module.exports = {
    account_balance
};




