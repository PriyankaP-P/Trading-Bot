// let data = ['btc','eos', 'ltc', 'ada', 'eth', 'poe'];
// let equal_symbols = [];
// let action = 'buy';
// for(let i=0;i< data.length; i++){
//     equal_symbols.push([data[i], action]);
// }
// console.log(equal_symbols);


const ccxt = require('ccxt');
const exchange = new ccxt['binance']();
exchange.enableRateLimit = true;        
exchange.options['warnOnFetchOHLCVLimitArgument'] = true;
const ema = require('./ema');

async function equal_ema(symbol_l, interval){

    const ohlcv = await exchange.fetchOHLCV(symbol_l, interval);

    let equal_ema_condition;
    let ema55 =await ema.calculateEma( ohlcv, 55);
    let ema21 =await ema.calculateEma( ohlcv, 21);
    let ema13 =await ema.calculateEma( ohlcv, 13);
    let ema8 =await ema.calculateEma( ohlcv, 8);

    let perCent55_21 = ((ema55-ema21)/ema55)*100;
    let perCent55_13 = ((ema55-ema13)/ema55)*100;
    let perCent55_8 = ((ema55-ema8)/ema55)*100;

    if((perCent55_21 <= 0.5 && perCent55_21 >= -0.5)||
      (perCent55_13 <= 0.5 && perCent55_13 >= -0.5)
     ||(perCent55_8 <= 0.5 && perCent55_8 >= -0.5)) {
           
        equal_ema_condition = true;

    }else{   equal_ema_condition = false;      
        }

        // console.log(equal_ema_condition);
        return equal_ema_condition;

}

(async function calling_data(){
    let checking = await equal_ema('NANO/BTC', '15m');
    console.log(checking);
})();