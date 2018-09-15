"use strict";


async function calculateGeneralEma(data, period){
    try
    {
    let ema = [];
    let arr = [];
    let prec;
    let multiplier = 2/(period +1);
    
   
        for(let count =0; count< period; count++){
              
            arr.push(data[count]);
        }
       
        let sma_arr = arr.slice(0, period-1);
        let sum = sma_arr.reduce((total, sma) => total + sma, 0);
        let sma1 = sum/period;
        ema.push(sma1);
        
        for(let i =1; i< data.length; i++){
            let calc = multiplier *((data[i])-ema[i-1]) + ema[i-1];
            
            if(data[i] < 0.0005)
                prec = 11;
            else
                prec = 9;
                    
            let result = Math.round(calc*(Math.pow(10, prec)))/(Math.pow(10, prec));
            ema.push(result);
                            
        }
        // for(let x = ema.length-1; x>=ema.length - 10; x--){
        //     console.log(ema[x]);
        // }
        return ema[ema.length-1];
   }catch(error){
       console.log(error + 'Failed at ema func');
   }
    
}


module.exports = {
    calculateGeneralEma
};



