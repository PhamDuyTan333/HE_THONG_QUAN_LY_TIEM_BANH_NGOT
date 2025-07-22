// config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Supabase PostgreSQL connection
let pool;

if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL from Supabase
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} else {
  // Development: Use individual environment variables
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;