"use strict";

const trade = require('./trade');
const long = require('./long');
const isEqual = require('./isEqual');
const markets = require('./markets');
const orders = require('./orders');
const balances = require('./checkBalance');

setInterval(async function app(){
    try{
        const interval = '15m';
        const standard_trade_currency = 'BTC';
        let base_currency = '/' + standard_trade_currency;
        let daily_cutoff_vol = 1000;
        const trade_amt= 0.01;
        let available_balance = await balances.account_balance(standard_trade_currency);
        let local_symbols = await markets.symbolsUsed(base_currency, daily_cutoff_vol);
        let arr_to_scan = await orders.open_symbols(local_symbols);
        let isEqual_result = await isEqual.arr_list(arr_to_scan, interval);
        await trade.call_trade_symbol(isEqual_result, available_balance, trade_amt);
                
        console.log("scan app works");
    }catch(e){
        console.log(e);
    }
    
}, 30000);


setInterval(async function sale_app(){
    try{
        const interval = '15m';
        
        await long.long_positions(interval);
        console.log("sale app works");
    }catch(e){
        console.log(e);
    }
    
}, 20000);
