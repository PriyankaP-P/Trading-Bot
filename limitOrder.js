"use strict";

const ccxt = require('ccxt');
const database = require('./knexfile');


const exchange = new ccxt.binance ({
    'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
    'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4',
    'verbose': false,
    'timeout': 60000,
    'enableRateLImit': true,
})

async function makeOrder(symbol, side, amount, price){

    const orderType = 'limit';
   
    try {
        let response = await exchange.createOrder(symbol, orderType, side, amount, price);
        console.log(response);
        return response;
    } catch (e) {
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');
    }
     
}


async function placeOrders(){
    try{    
    let order_list = await database('transactions')
                                .where({fulfilled: false,
                                    order_status: 'open'})
                                .whereNull('exchange_client_id')
                                .select()
                                .then(function(rows){
                                    return rows;
                                }).catch(function(error){
                                    console.log(error);
                                });

        
    for(let i =0; i< order_list.length; i++){
        
        let transactionId = order_list[i].transaction_id;
        let symbol =order_list[i].symbol_pair;
        let side = order_list[i].transaction_type;
        let price = order_list[i].price_base_currency;
        let amount = (order_list[i].equivalent_amt_base_currency)/price;

        let sending_orders = await makeOrder(symbol, side, amount, price);
        
        let order_info = await database('transactions')
                                            .where('transaction_id', transactionId)
                                            .update({exchange_client_id: sending_orders['id'],
                                                    exchange_timestamp: sending_orders['timestamp']})
                                            .then(function(rows){
                                                return rows;
                                            }).catch(function(error){
                                                console.log(error);
                                            }); 
                     
    }
    }catch(e){
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');

    }
}


async function order_status(){
    try{
    let open_orders_array = await database('transactions')
                                .where('order_status', 'open')
                                .whereNotNull('exchange_client_id')
                                .select('transaction_id', 'symbol_pair', 'exchange_client_id')
                                .then(function(row){
                                  return row;
                                }).catch(function(err){
                                console.log(err);
                                })
    // console.log(open_orders_array);
    for(let i=0; i< open_orders_array.length; i++){
        let id = open_orders_array[i].exchange_client_id;
        let symbol = open_orders_array[i].symbol_pair;
        let result = await exchange.fetchOrder(id, symbol);
        // console.log(result);
        if(result.status === 'canceled'){
           
            let update_order = await database('transactions')
                                .where('transaction_id', open_orders_array[i].transaction_id )
                                .update('order_status', result.status)
                                .then(function(row){
                                 return row;
                                }).catch(function(err){
                                console.log(err);
                                })
        }else if(result.status === 'closed'){
            let update_order = await database('transactions')
                                .where('transaction_id', open_orders_array[i].transaction_id )
                                .update({'order_status': result.status, 'fulfilled': true,
                                 'position_status': 'new'})
                                .then(function(row){
                                return row;
                                }).catch(function(err){
                                console.log(err);
                                })
        }
    }
        }catch(e){
            console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
            console.log('Failed');

}
}

async function cancel_orders(){
    try{
    let cancel_list = await database('transactions')
                                            .where('order_status', 'open')
                                            .whereNotNull('exchange_client_id')
                                            .select('transaction_id', 'symbol_pair', 'exchange_client_id',
                                             'exchange_timestamp')
                                            .then(function(row){
                                            return row;
                                            }).catch(function(err){
                                            console.log(err);
                                            })
        // console.log(cancel_list);
    for(let i =0;i< cancel_list.length; i++){
        let id = cancel_list[i].exchange_client_id;
        let symbol = cancel_list[i].symbol_pair;
        
        if(exchange.nonce() >= (parseInt(cancel_list[i].exchange_timestamp) + (180*1000))){
          
            let terminate = exchange.cancelOrder(id, symbol);

            console.log(terminate);
            console.log(`order id = ${id} cancelled`)
        }
    }
        }catch(e){
            console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
            console.log('Failed');

    }
}

async function monitor_position_status(){
    try{
        
         database('transactions')
                        .where({transaction_type: 'sell',
                                 fulfilled: true,
                                 order_status: 'closed',
                                 position_status: 'new'})
                         .whereNotNull('exchange_client_id')
                         .update('position_status', 'old')
                         .then(function(row){
                         return row;
                         }).catch(function(err){
                         console.log(err);      
                         })
        
        let list_old_transactions = await database('transactions')
                                                    .where({transaction_type: 'sell',
                                                            fulfilled: true,
                                                            order_status: 'closed',
                                                            position_status: 'old'})
                                                    .whereNotNull('selling_pair_id')
                                                    .select('transaction_id')
                                                    .then(function(row){
                                                        return row;
                                                    }).catch(function(err){
                                                        console.log(err);
                                                    })
        for(let i =0; i<list_old_transactions.length; i++){
                             database('transactions').where('transaction_id', list_old_transactions[i].selling_pair_id)
                                                     .update('position_status', 'old')
                                                     .then(function(row){
                                                        return row;
                                                    }).catch(function(err){
                                                        console.log(err);
                                                    })
        }
             
    }catch(e){
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');
    }

}
setInterval(async function call(){
    await placeOrders();
    await order_status();
    await cancel_orders();
    await monitor_position_status();
}, 2000);




module.exports = {
    makeOrder,
    placeOrders,
    order_status
};