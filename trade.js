"use strict";
const database = require('./knexfile'); 
const tickers = require('./tickers');
const date = new Date();

    

async function record(data1){
    
    let possible_positions= [];
    let amount = 1;// has to be related to balance ----incomplete

   
    for(let i =0; i< data1.length; i++){
        
       let transaction = '';
       
       let price = await tickers.tics(data1[i][0], data1[i][1]);
       console.log(`price = ${price}  0= ${data1[i][0]}   1= ${data1[i][1]}` );
     if(data1[i][1] === 'bid'){
        transaction = 'buy';
        
     possible_positions.push([data1[i][0], data1[i][1], price, transaction]);
     
     database('transactions').insert({trade_date: date, symbol_pair: data1[i][0], 
        price_btc: price, quantity: amount, transaction_type: transaction, fulfilled: 'f', order_status: 'open' })
        .then(function(row){
        console.log(row);
    }).catch(function(err){
        console.log(err);
    })

    }
   }

   return possible_positions;
}


async function call_trade_symbol(trade_symb_data){
    try{
        
        let res = await record(trade_symb_data);
        console.log(res);
    }catch(e){
        console.log(e);
    }
  
    
}


module.exports ={
    record,
    call_trade_symbol
}