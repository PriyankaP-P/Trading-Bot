// const database = require('./knexfile'); 


// database.select('transaction_id' , 'symbol_pair').from('transactions').then(function(rows){
//     console.log(rows);
//     return rows;
// })
// .catch(function(error){
//     console.log(error);
// });

// database.raw(
//     `INSERT INTO symbols_met_equality (symbol_pair) VALUES (data[i])
//     ON CONFLICT ON CONSTRAINT (id)
//     DO
//     UPDATE
//     SET symbol_pair =data[i] returning *`,
//     { symbol_pair }
//   ).then(function(rows){
//     console.log(rows);
//     return rows;
// })
// .catch(function(error){
//     console.log(error);
// });


// "use strict";

// const ccxt = require('ccxt');
// const exchange = new ccxt['binance']();
// exchange.enableRateLimit = true;       
// exchange.options['warnOnFetchOHLCVLimitArgument'] = true;
// const tickers = require('./tickers');
// const if_equal = require('./if-ema-equal');
// const date = new Date();
// const database = require('./knexfile'); 



                    
// (async function long_positions(){

        
//     let open_sell_orders = await database('transactions')
//                         .where({transaction_type: 'sell',
//                                 fulfilled: false,
//                                 order_status: 'open'})
//                         .whereNull('exchange_client_id')
//                         .select('selling_pair_id')
//                         .then(function(rows){
//                             return rows;
//                         }).catch(function(error){
//                             console.log(error);
//                         })
//        console.log(open_sell_orders[0].selling_pair_id);
     
// })();




// "use strict";

// const ccxt = require ('ccxt');

// let binance = new ccxt.binance({
//     'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
//     'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4',
//     'options': {
//         'adjustForTimeDifference': true,
//         'verbose': true,
//         'recvWindow': 10000000
//     }        
// });



// (async function tradeBal() {
    
//     let balance = await binance.fetchBalance ();
    
//     let symbol = 'ONT';
//     let find_trade = balance.info.balances.filter(each => each.asset === symbol);
//     let amount = find_trade[0].free;
//     console.log(amount);
    
//     // return base_balance;    
    
// })();
// let interval = '3m';
// let timeframe = '';
// for(let c=0; c< interval.length; c++){
//     if(interval[c] < 'A'){
//         timeframe += interval[c];
//     }
// }
// console.log(parseInt(timeframe));

(async () => {

    const ccxt = require('ccxt');
    const exchange = new ccxt['binance']({
    'enableRateLimit': true,
    'options': {
        'adjustForTimeDifference': true,
        'verbose': true,
        'recvWindow': 10000000,
        'warnOnFetchOHLCVLimitArgument': true
    }
    });
    
    const result = await exchange.fetchTicker('ETH/BTC');
    console.log(result);
    // const ohlcv = await exchange.fetchOHLCV('ETH/BTC', '1h');
    // console.log(ohlcv[0][4]);

}) ();