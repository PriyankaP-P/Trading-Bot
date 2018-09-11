"use strict";

const database = require('./knexfile.js');
const date = new Date();
const ccxt = require('ccxt');
const exchange = new ccxt['binance']({
    'enableRateLimit': true,
    'options': {
        'verbose': true,
        'adjustForTimeDifference': true,
        'recvWindow': 10000000,
        'warnOnFetchOHLCVLimitArgument': true
    }
});

async function get_price(symbol){
    try
    {
        const response = await exchange.fetchTicker(symbol);
        let last_price = response['last'];
        return last_price;
    }catch(e){
        console.log(e);
    }
}



async function cut_loss(stop_loss_percent){
    try
    {
        let current_buys = await database('transactions').where({ transaction_type: 'buy',
                                                              fulfilled: 'true',
                                                              order_status: 'closed',
                                                              position_status: 'new',
                                                              })
                                                    .whereNotNull('exchange_client_id')
                                                    .select()
                                                    .then(rows => rows)
                                                    .catch(error =>console.log(error))
    let percent_conv = stop_loss_percent/100;     
    
    for(let i= 0; i<current_buys.length; i++){

        let buy_price =current_buys[i].price_base_currency;
        let criteria = buy_price - (buy_price*percent_conv);
        let symbol_pair = current_buys[i].symbol_pair;
        let last_price = await get_price(symbol_pair);
        console.log(last_price);
        let open_sell_orders_for_stoploss = await database('transactions')
                                                .where({transaction_type: 'sell',
                                                        fulfilled: false,
                                                        order_status: 'open'})
                                                .select('selling_pair_id')
                                                .then(rows => rows)
                                                .catch(error =>console.log(error))

        if(open_sell_orders_for_stoploss.length >0){                                
            for(let j =0; j< open_sell_orders_for_stoploss.length; j++){
             
                if(last_price <= criteria && 
                    current_buys[i].transaction_id !== open_sell_orders_for_stoploss[j].selling_pair_id){//<=
                        await database('transactions').insert({ trade_date: date, symbol_pair: symbol_pair,
                                                    price_base_currency: last_price,
                                                    equivalent_amt_base_currency: current_buys[i].equivalent_amt_base_currency,
                                                    transaction_type: 'sell', fulfilled: 'f',
                                                    order_status: 'open', selling_pair_id: current_buys[i].transaction_id})
                                                    .then(rows => rows)
                                                    .catch(error =>console.log(error))
                }
            }
        }else{
            
            if(last_price <= criteria ){//<=
                    await database('transactions').insert({ trade_date: date, symbol_pair: symbol_pair,
                                                price_base_currency: last_price,
                                                equivalent_amt_base_currency: current_buys[i].equivalent_amt_base_currency,
                                                transaction_type: 'sell', fulfilled: 'f',
                                                order_status: 'open', selling_pair_id: current_buys[i].transaction_id})
                                                .then(rows => rows)
                                                .catch(error =>console.log(error))
            }
        }
    }
    }catch(e){
        console.log(e);
    }
}


setInterval(async function prevent_loss(){
    const stop_loss_percent = 3;
    await cut_loss(stop_loss_percent);
}, 20000);


