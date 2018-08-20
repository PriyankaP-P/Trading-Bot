"use strict";

const ccxt = require('ccxt');
const exchange = new ccxt.binance ({
    'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
    'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4',
    'verbose': false,
    'timeout': 60000,
    'enableRateLImit': true,
})
//let symbol = 'EOS/BTC';
// let amount = 15.00000000;
// let price = 0.0006339; 
//let side = 'buy';

async function makeOrder(symbol, side, amount, price){

    const orderType = 'limit';
   
    try {
        let response = await exchange.createOrder(symbol, orderType, side, amount, price);
        let timestamp = response['timestamp'];
        let id = response['id'];
        console.log(response);
        console.log('succeeded');
        console.log("\n");
        console.log('Timestamp of order= ' + timestamp + "\n" + side+ 'order Id = '+ id);

    } catch (e) {
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');
    }
     
}

//makeOrder(symbol, side, amount, price);

module.exports = {
    makeOrder
};