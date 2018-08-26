
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

    let sell_list =await database('transactions')
                            .where({transaction_type:'buy',
                                    fulfilled: true,//true
                                    order_status: 'closed',
                                    position_status: 'new'})
                            .whereNull('selling_pair_id')
                            .select()   
                            .then(function(rows){
                                    return rows;
                                }).catch(function(error){
                                    console.log(error);
                                });

    // console.log(sell_list);
    let action = 'ask';
    const trans_type = 'sell';
    for(let i=0; i< sell_list.length; i++){

        const ohlcv = await exchange.fetchOHLCV(sell_list[i].symbol_pair, interval);
        let condition = await if_equal.equal_ema(ohlcv);
        let timePassed = parseInt(sell_list[i].exchange_timestamp);
        if(condition === true && timePassed > (5*60*1000)){ //&& sell_list[i].transaction_id === unique in selling_pair_id column ){
        
            let price = await tickers.tics(sell_list[i].symbol_pair, action);

            database('transactions').insert({trade_date: date, symbol_pair: sell_list[i].symbol_pair, 
            price_base_currency: price, equivalent_amt_base_currency: sell_list[i].equivalent_amt_base_currency,
            transaction_type: trans_type,fulfilled: 'f', order_status: 'open', 
            selling_pair_id: sell_list[i].transaction_id})//quantity might have to be changed after deducting trading fees
                                    .then(function(row){
                                    
                                    console.log(row);
                                    return row;
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


