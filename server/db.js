const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection established successfully');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit if we can't connect to the database
    }
};

// Initial connection test
testConnection();

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle database connection:', err);
    process.exit(1);
});

module.exports = pool; 