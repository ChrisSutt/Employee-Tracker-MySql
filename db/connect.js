const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'1234',
    database: 'employee_tracker_db',
    connectionLimit: 10,
});



module.exports = db;