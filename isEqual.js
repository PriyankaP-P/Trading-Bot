
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
        let filtered_symbols =[];
        let open_array = await orders.open_symbols();
        console.log(`open_array = ${open_array}`);
        for (let i = 0; i < data.length; i++) {
            const ohlcv = await exchange.fetchOHLCV(data[i], interval);
            let condition = await if_equal.equal_ema(ohlcv);
            

            if(condition === true) {
                watch_symbols.push(data[i]);
        }    
        }    
        console.log(`watch_symbols =  ${ watch_symbols}`);
        
        filtered_symbols = watch_symbols.filter(item => open_array.every(item2 => item2 !== item));
        
        console.log(`filtered_symbols =  ${filtered_symbols}`);

        const trade_symbols =[];    
        
        for (let i = 0; i < filtered_symbols.length; i++) {
            const ohlcv = await exchange.fetchOHLCV(filtered_symbols[i], interval);
            let action = 'wait'; 
            
            let ema55 =await ema.calculateEma(ohlcv, 55);
            let ema21 =await ema.calculateEma(ohlcv, 21);
            let ema13 =await ema.calculateEma(ohlcv, 13);
            let ema8 =await ema.calculateEma(ohlcv, 8);
            
        
        if(ema8 > ema55 && ema13 > ema55 && ema21 > ema55) {
                action = 'bid';
            trade_symbols.push([filtered_symbols[i], action]);
            } 
        else{
            console.log('action = '+ action + ' for symbol=' + filtered_symbols[i]);
            }      
    }   
    return trade_symbols;
};

async function arr_list(interval, base_currency, daily_cutoff_vol) { 
   
       try{
            let local_symbols = await markets.symbolsUsed(base_currency, daily_cutoff_vol);
          
            let result_tradeSymbol = await loop(local_symbols, interval);
            
            return result_tradeSymbol;
       }catch (err){
             console.log(err);
          }
}



module.exports ={
    loop,
    arr_list
};

