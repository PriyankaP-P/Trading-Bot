"use strict";

const database = require('./knexfile'); 

let order_pairs =  database.select('symbol_pair').from('transactions').then(function(rows){
        return rows;
    }).catch(function(error){
        console.log(error);
    });

    


async function open_symbols(){
    let response = await order_pairs;
    let open_arr =[];
    for(let i=0; i< response.length; i++){
        open_arr.push(response[i].symbol_pair);
    }
    console.log(open_arr);
  
    return open_arr;


}


module.exports = {
    open_symbols
};

