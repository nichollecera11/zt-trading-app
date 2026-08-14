import mysql from 'mysql2/promise';

// Keep your debugging log to make sure Vercel sees your variables!
console.log({
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
});

const pool = mysql.createPool({
  // Your original smart fallbacks
  host: process.env.MYSQL_HOST || process.env.DB_HOST,
  port: process.env.MYSQL_PORT || 24078,
  user: process.env.MYSQL_USER || 'avnadmin',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  
  // Your original SSL requirement for Aiven
  ssl: {
    rejectUnauthorized: false
  },

  // 👇 NEW: The Connection Pool optimizations 👇
  waitForConnections: true,
  connectionLimit: 10, // Keeps Aiven safe on the free tier
  queueLimit: 0
});

export default pool;