const markets = require('./markets');
const ema = require('./ema');


let local_symbols = [];
let watch_symbols =[];

async function loop (data, interval) {
    
    for (let i = 0; i < data.length; i++) {
        
        let ema55 =await ema.calculateEma( data[i], interval, 55);
        let ema21 =await ema.calculateEma( data[i], interval, 21);
        let ema13 =await ema.calculateEma( data[i], interval, 13);
        let ema8 =await ema.calculateEma( data[i], interval, 8);

        let perCent55_21 = ((ema55-ema21)/ema55)*100;
        let perCent55_13 = ((ema55-ema13)/ema55)*100;
        let perCent55_8 = ((ema55-ema8)/ema55)*100;

        if((perCent55_21 <= 0.5 && perCent55_21 >= -0.5)||
          (perCent55_13 <= 0.5 && perCent55_13 >= -0.5)
         ||(perCent55_8 <= 0.5 && perCent55_8 >= -0.5)) {
    
            watch_symbols.push(data[i]);

        }else{
        //    console.log('no data for i=' + i + 'symbol='+ data[i]);
        }     
    }
   
    return watch_symbols;
};

async function arr_list(interval) { 
    
       try{

            let result = await loop(local_symbols = await markets.symbolsUsed(), interval);
            console.log(result);
            return result;
       }catch (err){
             console.log(err);
          }
}



module.exports ={
    loop,
    arr_list
};

