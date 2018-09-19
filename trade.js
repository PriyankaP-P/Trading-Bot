"use strict";
const database = require('./knexfile'); 
const tickers = require('./tickers');
const fs = require('fs');
const date = new Date();


    

async function record(data1, available_balance, trade_amt){//get total balance
    try{
        let possible_positions= [];
        
       console.log(available_balance);
        let amount = available_balance;
        console.log("amount = " + amount);
        fs.appendFile(
            "log.txt",
            `${date}  available balance(amount) = ${amount} \n`,
            error => {
                if(error) throw error;
            } 
        );
            for(let i =0; i< data1.length; i++){
            
                let transaction = '';
                
                let price = await tickers.tics(data1[i][0], data1[i][1]);
                console.log(`price = ${price}  0= ${data1[i][0]}   1= ${data1[i][1]}` );
                fs.appendFile(
                    "log.txt",
                    `${date}  price = ${price}  0= ${data1[i][0]}   1= ${data1[i][1]} \n`,
                    error => {
                        if(error) throw error;
                    } 
                );
                
            if(data1[i][1] === 'bid' && available_balance> trade_amt){

                transaction = 'buy';
                
                possible_positions.push([data1[i][0], data1[i][1], price, transaction]);
                
                let add = await database('transactions').insert({trade_date: date, symbol_pair: data1[i][0], 
                    price_base_currency: price, equivalent_amt_base_currency: trade_amt, 
                    transaction_type: transaction, fulfilled: 'f', order_status: 'open' })
                    .then(function(row){
                    console.log(row);
                }).catch(function(err){
                    console.log(err);
                })

                    available_balance= available_balance - trade_amt;
            }else{
                console.log("insufficient base currency balance");
                fs.appendFile(
                    "log.txt",
                    `${date}  insufficient base currency balance \n`,
                    error => {
                        if(error) throw error;
                    } 
                );
            }
            }
            
        }catch(e){
        console.log(e);
    }
    
}


async function call_trade_symbol(isEqual_result, available_balance , trade_amt){
    try{
             
        let res = await record(isEqual_result, available_balance , trade_amt);
        
    }catch(e){
        console.log(e);
    }
  
    
}


module.exports ={
    record,
    call_trade_symbol
}