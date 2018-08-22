"use strict";

const ccxt = require('ccxt');
const exchange = new ccxt['binance']();
exchange.enableRateLimit = true;       
exchange.options['warnOnFetchOHLCVLimitArgument'] = true;
const tickers = require('./tickers');
const if_equal = require('./if-ema-equal');
const date = new Date();

const database = require('./knexfile'); 

let long_pairs =  database('transactions')
                  .where('transaction_type', 'buy')
                  .select()   
                    .then(function(rows){
                            return rows;
                        }).catch(function(error){
                            console.log(error);
                        });

(async function long_positions(){// run every 30 secs
    let interval = '15m';
    let response_obj = await long_pairs;
    let action = 'ask';
    const trans_type = 'sell';
    for(let i=0; i< response_obj.length; i++){
        const ohlcv = await exchange.fetchOHLCV(response_obj[i].symbol_pair, interval);
        let condition = await if_equal.equal_ema(ohlcv);

        if(condition === true && response_obj[i].fulfilled === true){
            let price = await tickers.tics(response_obj[i].symbol_pair, action);

            database('transactions').insert({trade_date: date, symbol_pair: response_obj[i].symbol_pair, 
                price_btc: price, quantity: response_obj[i].quantity, transaction_type: trans_type, fulfilled: 'f'})
                .then(function(row){
                console.log(row);
            }).catch(function(err){
                console.log(err);
            })
       
        }
        console.log(response_obj[i]);
    }    
     
})();




// (async function long_positions(){
//     let response_obj = await long_pairs;
//     let long_open_arr_symbol = [];
//     for(let i=0; i< response_obj.length; i++){
//         long_open_arr_symbol.push(response_obj[i].symbol_pair);
//     }
//     console.log(response_obj);
//     console.log(long_open_arr_symbol);

//     for(let j; j< long_open_arr_symbol.length)
    
//     // return open_arr;  
// })();