"use strict";

// const database = require('./knexfile'); 
const tickers = require('./tickers');
const date= new Date();
// const limitOrder = require('./limitOrder');
const isEqual = require('./isEqual');

let call_arr =[];

async function record(data1){
    console.log(data1.length);
    let open_positions= [];
    for(let i =0; i< data1.length; i++){
       
       let price = await tickers.tics(data1[i][0], data1[i][1]);
       console.log(`price = ${price}  0= ${data1[i][i]}   1= ${data1[i][i+1]}` );
       open_positions.push([data1[i][0]], data1[i][1], price);
   }

   return open_positions;
};


(async function call_trade_symbol(){
    let ans = await record(call_arr = await isEqual.arr_list());
    console.log(call_arr);
    console.log(ans);
    
})();