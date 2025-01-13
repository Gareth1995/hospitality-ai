// get counts of visitors per country
import { NextResponse } from 'next/server';
// import { pool } from '../../../utils/db'; // Your DB connection pool
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

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT country, COUNT(*) AS count
      FROM bookings
      GROUP BY country
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching country counts:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}