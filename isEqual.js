
const ccxt = require('ccxt');
const exchange = new ccxt['binance']();

exchange.enableRateLimit = true;
        
exchange.options['warnOnFetchOHLCVLimitArgument'] = true;

const ema = require('./ema');

const if_equal = require('./if-ema-equal');



async function loop (data, interval) {
   try{
        let equal_symbols =[];
        
        for (let i = 0; i < data.length; i++) {
            const ohlcv = await exchange.fetchOHLCV(data[i], interval);
            let condition = await if_equal.equal_ema(ohlcv);
            
            if(condition === true) {
                equal_symbols.push(data[i]);
        }    
        }    
        console.log(`equal_symbols =  ${ equal_symbols}`);
        const trade_symbols =[];    
        
        for (let i = 0; i < equal_symbols.length; i++) {
            const ohlcv = await exchange.fetchOHLCV(equal_symbols[i], interval);
            let action = 'wait'; 
            
            let ema55 =await ema.calculateEma(ohlcv, 55);
            let ema21 =await ema.calculateEma(ohlcv, 21);
            let ema13 =await ema.calculateEma(ohlcv, 13);
            let ema8 =await ema.calculateEma(ohlcv, 8);
            
        
        if(ema8 > ema55 && ema13 > ema55 && ema21 > ema55) {
                action = 'bid';
            trade_symbols.push([equal_symbols[i], action]);
            } 
        else{
            console.log('action = '+ action + ' for symbol=' + equal_symbols[i]);
            }      
    }   
    return trade_symbols;
   } catch (err){
    console.log(err);
 }
        
}

async function arr_list(arr_to_scan, interval) { 
   
       try{
            let result_tradeSymbol = await loop(arr_to_scan, interval);
            
            return result_tradeSymbol;
       }catch (err){
             console.log(err);
          }
}



module.exports ={
    loop,
    arr_list
};

