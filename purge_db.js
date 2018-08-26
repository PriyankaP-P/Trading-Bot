const database = require ('./knexfile');
const date = new Date();

setInterval(async function clear(){
    try{

        let clear_list = await database('transactions')
                                            .where({fulfilled: false,
                                                    order_status: 'open'})
                                            .whereNull('exchange_client_id')
                                            .select('transaction_id', 'trade_date')
                                            .then(function(row){
                                            return row;
                                            }).catch(function(err){
                                            console.log(err);
                                            })
        
        for(let i =0; i< clear_list.length; i++){
            let temp = Date.parse(clear_list[i].trade_date);         
            let elapsedTime = temp + (5*60*1000);   
            if( temp <= elapsedTime){
                await database('transactions')
                                            .where('transaction_id', clear_list[i].transaction_id)
                                            .del()
                                            .then(function(row){
                                            return row;
                                            }).catch(function(err){
                                            console.log(err);
                                            });
                
            }
        }
    }catch(e){
        console.log(exchange.iso8601 (Date.now()), e.constructor.name, e.message);
        console.log('Failed');
    }
},120000);