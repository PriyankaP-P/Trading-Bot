"use strict";


async function calculateEmaMacd(ohlcv, period){
    try
    {const index =4;//ema calculated on closing price of candles ccxt
    //  const ohlcv = await exchange.fetchOHLCV(symbol, interval);
    let ema = [];
    let arr = [];
    // let signal_arr=[];
    let prec;
    let multiplier = 2/(period +1);
    
   
        for(let count =0; count< period; count++){
              
            arr.push(ohlcv[count][index]);
        }
       
        let sma_arr = arr.slice(0, period-1);
        let sum = sma_arr.reduce((total, sma) => total + sma, 0);
        let sma1 = sum/period;
        ema.push(sma1);
        
        for(let i =1; i< ohlcv.length; i++){
            let calc = multiplier *((ohlcv[i][index])-ema[i-1]) + ema[i-1];
            
            if(ohlcv[i][index] < 0.0005)
                prec = 11;
            else
                prec = 9;
                    
            let result = Math.round(calc*(Math.pow(10, prec)))/(Math.pow(10, prec));
            ema.push(result);
                            
        }
        // for(let x = ema.length-2; x>=0; x--){
        //     signal_arr.push(ema[x]);
        // }
        return ema;
   }catch(error){
       console.log(error + 'Failed at ema-macd func');
   }
    
}


module.exports = {
    calculateEmaMacd
};



