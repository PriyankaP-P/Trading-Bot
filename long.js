
"use strict";

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

const tickers = require('./tickers');
const if_equal = require('./if-ema-equal');
const date = new Date();
const database = require('./knexfile'); 
const maintenance = require('./maintenance');


async function update_sell_orders(entry, action){
    const trans_type = 'sell';
    let price = await tickers.tics(entry.symbol_pair, action);
                    
                await database('transactions').insert({trade_date: date, symbol_pair: entry.symbol_pair, 
                    price_base_currency: price, equivalent_amt_base_currency: entry.equivalent_amt_base_currency,
                    transaction_type: trans_type,fulfilled: 'f', order_status: 'open', 
                    selling_pair_id: entry.transaction_id})
                    .then(function(row){
                        console.log(row);
                        return row;
                    }).catch(function(err){
                        console.log(err);
                    })
}


async function long_positions(interval){

    let sell_list =await database('transactions')
                            .where({transaction_type:'buy',
                                    fulfilled: true,//true
                                    order_status: 'closed',
                                    position_status: 'new'})
                            .select()   
                            .then(function(rows){
                                    return rows;
                                }).catch(function(error){
                                    console.log(error);
                                });

    // console.log(sell_list);
    let action = 'ask';
    let timeframe = maintenance.get_timeframe(interval);
    console.log(timeframe);
    for(let i=0; i< sell_list.length; i++){

        const ohlcv = await exchange.fetchOHLCV(sell_list[i].symbol_pair, interval);
        let condition = await if_equal.equal_ema(ohlcv);
        let timePassed = parseInt(sell_list[i].exchange_timestamp);

        let open_sell_orders = await database('transactions')
                                        .where({transaction_type: 'sell',
                                                fulfilled: false,
                                                order_status: 'open'})
                                        .select('selling_pair_id')
                                        .then(function(rows){
                                            return rows;
                                        }).catch(function(error){
                                            console.log(error);
                                        })
                      
        if(open_sell_orders.length >0){                                
            for(let j =0; j< open_sell_orders.length; j++){
                if(condition === true && timePassed > (timeframe*3*60*1000) && sell_list[i].transaction_id !== open_sell_orders[j].selling_pair_id ){ 
            
                 await update_sell_orders(sell_list[i], action);
                    
                }else {
                    console.log("condition not met");
                }   
            }
        }else{
            if(condition === true && timePassed > (timeframe*3*60*1000)){ 
            
                await update_sell_orders(sell_list[i], action);
                
            }else {
                console.log("condition not met");
            }   
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
    
}, 30000);


module.exports={
    long_positions
}; 


