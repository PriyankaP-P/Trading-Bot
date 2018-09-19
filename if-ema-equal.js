
const ema = require('./ema');

async function equal_ema(ohlcv){

    let equal_ema_condition;
    let ema55 =await ema.calculateEma(ohlcv, 55);
    let ema21 =await ema.calculateEma(ohlcv, 21);
    let ema13 =await ema.calculateEma(ohlcv, 13);
    let ema8 =await ema.calculateEma(ohlcv, 8);
    
    let perCent21_55 = ((ema21-ema55)/ema55)*100;
    let perCent13_55 = ((ema13-ema55)/ema55)*100;
    let perCent8_55 = ((ema8-ema55)/ema55)*100;

    if((perCent21_55 <= 0.05 && perCent21_55 >= -0.05)||
      (perCent13_55 <= 0.05 && perCent13_55 >= -0.05)
     ||(perCent8_55 <= 0.05 && perCent8_55 >= -0.05)) {
           
        equal_ema_condition = true;

    }else{   equal_ema_condition = false;      
        }

        // console.log(equal_ema_condition);
        return equal_ema_condition;

}



module.exports={
    equal_ema
};