"use strict";

const database = require('./knexfile'); 



async function open_symbols(list){
    let open_arr =[];
    let filtered_symbols =[];
    
    let response =await database('transactions')
                    .where('order_status', 'open')
                    .select('symbol_pair')  
                    .then(function(rows){
                            return rows;
                        }).catch(function(error){
                            console.log(error);
                        });

    console.log(response);
    for(let i=0; i< response.length; i++){
        open_arr.push(response[i].symbol_pair);
    }
    // console.log(open_arr);
    let new_open_arr = open_arr.filter(function(elem, pos){
        return open_arr.indexOf(elem) == pos;
    });
    console.log(`new_open_arr = ${new_open_arr}`);
    filtered_symbols = list.filter(item => new_open_arr.every(item2 => item2 !== item));
    console.log(`filtered_symbols =  ${filtered_symbols}`);

    return filtered_symbols;
}


module.exports = {
    open_symbols
};

