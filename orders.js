"use strict";

const database = require('./knexfile'); 

let open=[];

async function open_orders(){

    // database('transactions').insert({trade_date: date, symbol_pair: data1[i][0], 
    //     price_btc: price, quantity: amount, position_type: position,
    //      transaction_type: transaction}).then(function(row){
    //     console.log(row);
    // }).catch(function(err){
    //     console.log(err);
    // })
    open = ['VET/BTC','REP/BTC','VEN/BTC','YOYOW/BTC'];
    return open;
    // setTimeout(async function delay (){
    //     open = ['VET/BTC'];
    //     return open;
    // }, 1000);
    // let getOpen = await delay();
    // console.log(getOpen);
    // return getOpen;

}

module.exports = {
    open_orders
};