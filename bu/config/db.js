require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "intern@123",
  database: process.env.DB_NAME || "vaccine",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error("Database does not exist. Please create the database first.");
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("Access denied. Please check your MySQL credentials.");
    } else if (err.code === 'ECONNREFUSED') {
      console.error("Connection refused. Please make sure MySQL server is running.");
    }
    return;
  }
  console.log("Connected to the database successfully!");
  connection.release();
});

// Handle connection errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

module.exports = db;
