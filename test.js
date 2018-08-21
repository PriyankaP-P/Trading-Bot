const database = require('./knexfile'); 


database.select('transaction_id' , 'symbol_pair').from('transactions').then(function(rows){
    console.log(rows);
    return rows;
})
.catch(function(error){
    console.log(error);
});

// database.raw(
//     `INSERT INTO symbols_met_equality (symbol_pair) VALUES (data[i])
//     ON CONFLICT ON CONSTRAINT (id)
//     DO
//     UPDATE
//     SET symbol_pair =data[i] returning *`,
//     { symbol_pair }
//   ).then(function(rows){
//     console.log(rows);
//     return rows;
// })
// .catch(function(error){
//     console.log(error);
// });