
const ema = require('./ema');

async function equal_ema(ohlcv){

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



module.exports={
    equal_ema
};