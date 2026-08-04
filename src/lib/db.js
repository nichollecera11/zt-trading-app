import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  // This tells Next.js to check for MYSQL_HOST first, and if it can't find it, use DB_HOST
  host: process.env.MYSQL_HOST || process.env.DB_HOST,
  port: process.env.MYSQL_PORT || 24078,
  user: process.env.MYSQL_USER || 'avnadmin',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;