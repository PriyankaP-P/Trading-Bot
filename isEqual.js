
const ccxt = require('ccxt');
const exchange = new ccxt['binance']();

exchange.enableRateLimit = true;
        
exchange.options['warnOnFetchOHLCVLimitArgument'] = true;

const markets = require('./markets');
const ema = require('./ema');
const orders = require('./orders');
const if_equal = require('./if-ema-equal');



async function loop (data, interval) {
    
    let watch_symbols =[];
    for (let i = 0; i < data.length; i++) {
        const ohlcv = await exchange.fetchOHLCV(data[i], interval);
        let condition = await if_equal.equal_ema(ohlcv);
        

        if(condition === true) {
            watch_symbols.push(data[i]);
       }else{
        //    console.log('no data for i=' + i + 'symbol='+ data[i]);
        }     
    }    
    console.log(`watch_symbols =  ${ watch_symbols}`);
    let open_arr = await orders.open_symbols();
    watch_symbols = watch_symbols.filter(item => open_arr.every(item2 => item2 !== item));

    console.log(`watch_symbols =  ${watch_symbols}`);

    const trade_symbols =[];    
       
    for (let i = 0; i < watch_symbols.length; i++) {
        const ohlcv = await exchange.fetchOHLCV(watch_symbols[i], interval);
        let action = 'wait'; 
        
        let ema55 =await ema.calculateEma(ohlcv, 55);
        let ema21 =await ema.calculateEma(ohlcv, 21);
        let ema13 =await ema.calculateEma(ohlcv, 13);
        let ema8 =await ema.calculateEma(ohlcv, 8);
        
    
       if(ema8 > ema55 && ema13 > ema55 && ema21 > ema55) {
            action = 'bid';
         trade_symbols.push([watch_symbols[i], action]);
        } else if(ema8 < ema55 && ema13 < ema55 && ema21 < ema55) {
            action = 'ask';
             trade_symbols.push([watch_symbols[i], action]);
         } else{

        console.log('action = '+ action + ' for symbol=' + watch_symbols[i]);
          }      
  }   
  return trade_symbols;

};

async function arr_list() { 
       const interval = '15m';
       try{
            let local_symbols = await markets.symbolsUsed();
            // console.log(local_symbols);
            // console.log("\n");
            let result_tradeSymbol = await loop(local_symbols, interval);
            // console.log(result_tradeSymbol);
            return result_tradeSymbol;
       }catch (err){
             console.log(err);
          }
}



module.exports ={
    loop,
    arr_list
};

