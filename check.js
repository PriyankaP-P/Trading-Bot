const markets = require('./markets');
const ema = require('./ema');

let local_symbols = [];
let watch_symbols =[];

async function loop (data) {

    const interval = '15m';
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
           console.log('no data for i=' + i + 'symbol='+ data[i]);
        }     
    }
    // console.log(watch_symbols);
    return watch_symbols;
};

(async function arr_list() { 
    loop(local_symbols = await markets.symbolsUsed()).then(function(watch_symbols){
        console.log(watch_symbols);
    }).catch(function(e){
        console.log(err);
    });
    // console.log(watch_symbols);
    
})();

