import { Pool } from 'pg';

// Set up PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Connection string (make sure this is set in your .env file)
    ssl: process.env.NODE_ENV === 'development' ? { rejectUnauthorized: false } : false, // SSL for production
});
  
// Error handling for unexpected connection issues
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export { pool };