// Importing Required Modules
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

// Setting up the connection credientials
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Making The connection
connection.connect();

// Events
connection.on('connect', () => {
    console.log('Database connected.');
});

connection.on('error', (err) => {
    console.log(err.message);
});

connection.on('end', () => {
    console.log('\nDatabase connection closed');
    process.exit(0);
});

process.on('SIGINT', () => {
    connection.end();
});

export default connection;