let knex = require('knex');

let database = knex({
    client: 'pg',
    version: '9.5',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '*MxT194mZb',
        database: 'bitomic'

    }
});

module.exports = database;