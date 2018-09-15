"use strict";

const ema_general = require('./ema-general');
const ema_macd = require('./ema-macd');
const ccxt = require('ccxt');
const exchange = new ccxt['binance']({
    'enableRateLimit': true,
    'options': {
        'adjustForTimeDifference': true,
        'verbose': true,
        'recvWindow': 10000000,
        'warnOnFetchOHLCVLimitArgument': true
    }
});



async function calc_macd(){
    try
    {
        let macd_arr=[];
        
        const ohlcv = await exchange.fetchOHLCV('BNB/BTC', '1h');
        let ema12 = await ema_macd.calculateEmaMacd(ohlcv, 12);
        let ema26 = await ema_macd.calculateEmaMacd(ohlcv, 26);
        
        for(let i=0; i< ema12.length; i++){
            let diff = ema12[i] -ema26[i];
            
            let temp = Math.round(diff*(Math.pow(10, 8)))/(Math.pow(10, 8));
            macd_arr.push(temp);
        }
        
        // console.log(`ema12= ${ema12.length}`);  
        // console.log(`ema26= ${ema26.length}`);   
        // console.log(`macd_arr= ${macd_arr.length}`);   
           
        return macd_arr;   

    }catch(error){
        console.log("Error at macd function " + error );
    }
}


(async function call(){
   try
   { 
    let signal_round =[];
  
    let macd_arr_data = await calc_macd();
    // console.log(macd_arr_data.length);
    let signal = await ema_general.calculateGeneralEma(macd_arr_data, 9);
    for(let i=0; i< signal.length; i ++){
        let temp =Math.round(signal[i]*(Math.pow(10, 8)))/(Math.pow(10, 8));
        signal_round.push(temp);  
    }
    let rev = signal_round.reverse();
    // for(let j= rev.length-1; j>=0; j--){
        console.log(rev.length);
    // }
    }catch(e){
        console.log('error at call func in macd.js '+ e);
    }
    
})();