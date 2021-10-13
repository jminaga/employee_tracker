
const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB',

});

connection.connect(function(err){
    if (err) throw err;
    console.log(`you're connected to databse!`);
})

connection.query = util.promisify(connection.query);

module.exports = connection;