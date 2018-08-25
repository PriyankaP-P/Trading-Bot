
const ccxt = require('ccxt');
const database = require('./knexfile');


const exchange = new ccxt.binance ({
    // 'apiKey': 'Ll8IQXn6q4ejxCM1QbQSUhUHqKR1ClRFh8U9YOACtw8hnwBGfZ9cpXTGmurVF1cl',
    // 'secret': '5nIYua2pdA2muFNt40JaksHRtqIXmzk38MGMwePPEeW2uKvB48BQNRjCKaaUU0k4',
    // 'verbose': false,
    // 'timeout': 60000,
    // 'enableRateLImit': true,
})




async function checkvalue(){

//     // let id = '49557953';
//     // let symbol = 'ONT/BTC';
//     // const result = await exchange.fetchOrder(id, symbol);
//     // console.log(result.status);

//     let order_data =[ { transaction_Id: '48ee407c-19a0-4be1-9f75-2545d490bdb7',
//     tradeId: '61496524',
//     symbol: 'LTC/BTC',
//     dateTime: 1535131099660,
//     status: 'open' },
//   { transaction_Id: 'ad560a02-8d4b-4946-a691-cf6ac368af2f',
//     tradeId: '49557953',
//     symbol: 'ONT/BTC',
//     dateTime: 1535131100160,
//     status: 'open' } ];

//     for(let i=0; i< order_data.length; i++){
//         let id = order_data[i].tradeId;
//         let symbol = order_data[i].symbol;
//         let result = await exchange.fetchOrder(id, symbol);
        
//         let update_order = await database('transactions')
//                                         .where('transaction_id', order_data[i].transaction_Id )
//                                         .update('order_status', 'open')
//                                         .then(function(row){
//                                         console.log(row);
//                                     }).catch(function(err){
//                                         console.log(err);
//                                         })
            
        
//     }
    //     let id = '61496524';
    //   let symbol= 'LTC/BTC';
    // let result =  await exchange.fetchOpenOrders();
    // console.log(result);

    console.log(typeof (exchange.milliseconds()));
}

checkvalue();