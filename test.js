
const markets = require('./markets');
const ema = require('./ema');
const async = require('async');


(async() =>{

    const watch_symbols =[];

    const data = await markets.symbolsUsed();
    console.log(data);

    function isEqual(symbol, interval){
        
        let promise = new Promise(function(resolve, reject){
            let equal =false;
        
            let ema55 = ema.calculateEma( symbol, interval, 55);
            let ema21 = ema.calculateEma( symbol, interval, 21);
            let ema13 = ema.calculateEma( symbol, interval, 13);
            let ema8 = ema.calculateEma( symbol, interval, 8);

            let perCent55_21 = ((ema55-ema21)/ema55)*100;
            let perCent55_13 = ((ema55-ema13)/ema55)*100;
            let perCent55_8 = ((ema55-ema8)/ema55)*100;

            if((perCent55_21 <= 0.5 && perCent55_21 >= -0.5)||
            (perCent55_13 <= 0.5 && perCent55_13 >= -0.5)
            ||(perCent55_8 <= 0.5 && perCent55_8 >= -0.5)) {
            
                equal = true;
                resolve(equal);
                
            }else{
                reject('no data');
            }
        });

        return promise;
        
    }

    const interval = '15m';

    await Promise.all(data.forEach(symbol => 
            
        Promise.resolve(async (resolve) =>{
            resolve(
            isEqual(symbol, interval)
            
            .then(function(equal){
                if(equal){
                    watch_symbols.push(symbol);
                    console.log(watch_symbols);
                }
                return watch_symbols;
            }).then(function(arr){
                console.log(arr);
            })
            .catch(function(err){
                console.log(err);
        })
    )})
            
            
            
    ))
})();



// async.waterfall([function(callback){
//     const data =Promise.resolve(markets.symbolsUsed());
//     callback(null, data);
// },
//     function(data, callback){
//         for(let i=0; i< data.length; i++){
//             if(isEqual(data[i]))
//                 watch_symbols.push(data[i]);   
                
//         }
//         callback(null, watch_symbols)
//     }], function(err, result){
        
//         console.log(result);
//     });   