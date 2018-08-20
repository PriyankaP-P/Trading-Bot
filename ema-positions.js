const ema = require('./ema');
const isEqual = require('./isEqual');

async function emaStatus (data, interval) {
    
    const trade_symbols =[];
    
    let action = 'wait';    

    for (let i = 0; i < data.length; i++) {
        console.log(data[i] + 'i=' +i);
        let ema55 =await ema.calculateEma( data[i], interval, 55);
        let ema21 =await ema.calculateEma( data[i], interval, 21);
        let ema13 =await ema.calculateEma( data[i], interval, 13);
        let ema8 =await ema.calculateEma( data[i], interval, 8);

        
    
       if(ema8 > ema55 && ema13 > ema55 && ema21 > ema55) {
            action = 'bid';
         trade_symbols.push([data[i], action]);
        } else if(ema8 < ema55 && ema13 < ema55 && ema21 < ema55) {
            action = 'ask';
             trade_symbols.push([data[i], action]);
         } else{

        console.log('action ='+ action + 'for symbol=' + data[i]);
          }
  }   
  return trade_symbols;

};


async function tradeStatus() {
    try{
        const interval = '15m';
        let equal_symbols = await isEqual.arr_list(interval);
        let ema_result = await emaStatus(equal_symbols, interval);
        console.log(ema_result);
         
    }catch(err){
    console.log(err);
    }

}

module.exports ={
    emaStatus,
    tradeStatus
};