
"use strict";

const ccxt = require('ccxt');
const exchange = new ccxt['binance']();
exchange.enableRateLimit = true;       
exchange.options['warnOnFetchOHLCVLimitArgument'] = true;
const tickers = require('./tickers');
const if_equal = require('./if-ema-equal');
const date = new Date();
const database = require('./knexfile'); 



                    
async function long_positions(interval){

    
    let prevent_repeat = await database('transactions')
                        .where({transaction_type: 'sell',
                                fulfilled: false,
                                order_status: 'open'})
                        .select('symbol_pair')   
                        .then(function(rows){
                                return rows;
                            }).catch(function(error){
                                console.log(error);
                            }); 
    let open_sell_orders = [];
    if(prevent_repeat.length> 0){
        for(let j=0; j< prevent_repeat.length ;j++){
            open_sell_orders.push(prevent_repeat[j].symbol_pair);
    }}
    console.log(`open_sell_orders =${open_sell_orders}`);

    let response_obj =await database('transactions')
                .where({transaction_type:'buy',
                        fulfilled: true,//true
                        order_status: 'open'})
                .select()   
                .then(function(rows){
                        return rows;
                    }).catch(function(error){
                        console.log(error);
                    });

    // console.log(response_obj);
    let action = 'ask';
    const trans_type = 'sell';
    for(let i=0; i< response_obj.length; i++){

        const ohlcv = await exchange.fetchOHLCV(response_obj[i].symbol_pair, interval);
        let condition = await if_equal.equal_ema(ohlcv);

        if(condition === true && open_sell_orders.indexOf(response_obj[i].symbol_pair) === -1 ){
        
            let price = await tickers.tics(response_obj[i].symbol_pair, action);

            database('transactions').insert({trade_date: date, symbol_pair: response_obj[i].symbol_pair, 
            price_base_currency: price, equivalent_amt_base_currency: response_obj[i].equivalent_amt_base_currency, transaction_type: trans_type,
            fulfilled: 'f', order_status: 'open'})//quantity might have to be changed after deducting trading fees
                                    .then(function(row){
                                    
                                    console.log(row);
                                    }).catch(function(err){
                                    console.log(err);
                                    })

            console.log("ready to sell position");
        }else {
                console.log("condition not met");
            }    
    }    
     
     
}

setInterval(async function sale_app(){
    try{
        const interval = '15m';
        
        await long_positions(interval);
        console.log("sale app works");
    }catch(e){
        console.log(e);
    }
    
}, 20000);


module.exports={
    long_positions
}; 


