// Citation for the following: var mysql, var pool, and export
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_garciawi',
    password        : '5053',
    database        : 'cs340_garciawi'
})

// Export it for use in our applicaiton
module.exports.pool = pool;