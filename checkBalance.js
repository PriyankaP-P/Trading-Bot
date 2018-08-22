"use strict";

const ccxt = require ('ccxt');

(async function order_amount() {
    let binance = new ccxt.binance({
        'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
        'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4'
    })

    let balance = await binance.fetchBalance ();
    console.log(balance);
    
}) ();


