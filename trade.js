"use strict";
const database = require('./knexfile'); 
const tickers = require('./tickers');
const isEqual = require('./isEqual');
const date = new Date();

let call_arr =[];

async function record(data1){
    // console.log(data1.length);
    let possible_positions= [];
    let amount = 1;// has to be related to balance ----incomplete
    for(let i =0; i< data1.length; i++){
        
       let transaction = '';
       
       let price = await tickers.tics(data1[i][0], data1[i][1]);
    //    console.log(`price = ${price}  0= ${data1[i][0]}   1= ${data1[i][1]}` );
     if(data1[i][1] === 'bid'){
        transaction = 'buy';
        
     }else if(data1[i][1] === 'ask'){
        transaction = 'sell';// check if i already have a position open in those coins
        
     }
       possible_positions.push([data1[i][0], data1[i][1], price, transaction]);
       database('transactions').insert({trade_date: date, symbol_pair: data1[i][0], 
        price_btc: price, quantity: amount, transaction_type: transaction, fulfilled: 'f'})
        .then(function(row){
        console.log(row);
    }).catch(function(err){
        console.log(err);
    })


   }

   return possible_positions;
};


(async function call_trade_symbol(){
    let res = await record(call_arr = await isEqual.arr_list());
    console.log(call_arr);
    console.log(res);
    
})();