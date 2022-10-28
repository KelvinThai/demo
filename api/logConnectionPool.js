require('dotenv').config();
const mysql = require('mysql2/promise');

const poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.LOG_DB_NAME,
    waitForConnections: true,
    connectionLimit: 50
};
const pool = mysql.createPool(poolConfig);
exports.pool = pool;