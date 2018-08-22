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
// let symbol = 'EOS/BTC';
// let amount = 15.00000000;
// let price = 0.0005339; 
// let side = 'buy';

async function makeOrder(symbol, side, amount, price){

    const orderType = 'limit';
   
    try {
        let response = await exchange.createOrder(symbol, orderType, side, amount, price);
       
        return response;
    } catch (e) {
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');
    }
     
}

let orders_to_place = database('transactions')
                        .where('fulfilled', false)
                        .select()
                        .then(function(rows){
                            return rows;
                        }).catch(function(error){
                            console.log(error);
                        });

(async function placeOrders(){
    let order_list = await orders_to_place;
    console.log(order_list);
    for(let i =0; i< order_list.length; i++){

        let symbol =order_list[i].symbol_pair;
        let side = order_list[i].transaction_type;
        let amount = order_list[i].quantity;
        let price = order_list[i].price_btc;

        let sending_orders = await makeOrder(symbol,side , amount , price);
        let tradeId = sending_orders['id'];
        let dateTime = sending_orders['datetime'];
        let status =sending_orders['status'];
        console.log(sending_orders);
      
    }
  
})();

setInterval(async function closed_trades(){
    const result = await exchange.fetchClosedOrders('EOS/BTC');
    console.log(result);

},20000);
// makeOrder(symbol, side, amount, price);

// module.exports = {
//     makeOrder
// };