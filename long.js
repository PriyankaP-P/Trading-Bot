"use strict";
const ema = require ('./ema');
const tickers = require('./tickers');

const database = require('./knexfile'); 

let long_pairs =  database('transactions')
                  .where('position_type', 'long')
                  .select()   
                    .then(function(rows){
                            return rows;
                        }).catch(function(error){
                            console.log(error);
                        });

(async function long_positions(){
    let response_obj = await long_pairs;
    let long_open_arr_symbol = [];
    for(let i=0; i< response_obj.length; i++){
        long_open_arr_symbol.push(response_obj[i].symbol_pair);
    }
    console.log(response_obj);
    console.log(long_open_arr_symbol);

    
    // return open_arr;  
})();