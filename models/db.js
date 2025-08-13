// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',       // MySQL host
    user: 'root',            // MySQL username
    password: 'Shubham@1',// MySQL password
    database: 'profile_db',  // Database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
