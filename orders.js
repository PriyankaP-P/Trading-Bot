"use strict";

const database = require('./knexfile'); 



async function open_symbols(){
    let response = await database('transactions')
                    .where('fulfilled', false)
                    .select('symbol_pair')  
                    .then(function(rows){
                            return rows;
                        }).catch(function(error){
                            console.log(error);
                        });
    let open_arr =[];
    for(let i=0; i< response.length; i++){
        open_arr.push(response[i].symbol_pair);
    }
    // console.log(open_arr);
    let new_open_arr = open_arr.filter(function(elem, pos){
        return open_arr.indexOf(elem) == pos;
    });
    // console.log(new_open_arr);
    return new_open_arr;


}


module.exports = {
    open_symbols
};

