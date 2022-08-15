const mysql = require('mysql2/promise');
const poolConfig = {
    host: '13.213.0.113',
    port: 3306,
    user: 'dequest',
    password: 'DQ@123456',
    database: 'LogMonitor',
    waitForConnections: true,
    connectionLimit: 50
};
const pool = mysql.createPool(poolConfig);
exports.pool = pool;