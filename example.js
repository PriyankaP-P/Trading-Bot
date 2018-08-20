let data = ['btc','eos', 'ltc', 'ada', 'eth', 'poe'];
let equal_symbols = [];
let action = 'buy';
for(let i=0;i< data.length; i++){
    equal_symbols.push([data[i], action]);
}
console.log(equal_symbols);
