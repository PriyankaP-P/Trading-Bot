const database = require('./knexfile'); 


database('symbols_met_equality').insert({symbol_pair: data[i]}).then(function(rows){
    console.log(rows);
    return rows;
})
.catch(function(error){
    console.log(error);
});

database.raw(
    `INSERT INTO symbols_met_equality (symbol_pair) VALUES (data[i])
    ON CONFLICT ON CONSTRAINT (id)
    DO
    UPDATE
    SET symbol_pair =data[i] returning *`,
    { symbol_pair }
  ).then(function(rows){
    console.log(rows);
    return rows;
})
.catch(function(error){
    console.log(error);
});