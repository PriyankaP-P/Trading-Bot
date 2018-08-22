"use strict";

const ccxt = require ('ccxt');

(async function () {
    let binance = new ccxt.binance({
        'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
        'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4'
    })

   
    //console.log(binance.id,  await binance.loadMarkets());
    
    //console.log(binance.id, await binance.fetchOrderBook (binance.symbols[0]));

    //console.log(binance.id, await binance.fetchTicker ('BTC/USDT'));

    //console.log(binance.id, await binance.fetchTrades ('ETH/BTC'));

    console.log(await binance.fetchBalance ());
    
}) ();


