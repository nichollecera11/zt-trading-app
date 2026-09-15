import mysql from 'mysql2/promise';

// Keep your debugging log to make sure Vercel sees your variables!
console.log({
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
});

// 👇 1. Create a global reference to survive hot reloads
const globalForDb = globalThis;

// 👇 2. Use the existing pool if it exists, otherwise create your Aiven pool
const pool = globalForDb.pool || mysql.createPool({
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

  // The Connection Pool optimizations
  waitForConnections: true,
  connectionLimit: 10, // Keeps Aiven safe on the free tier
  queueLimit: 0
});

// 👇 3. Save the pool to the global object ONLY in development mode
if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export default pool;