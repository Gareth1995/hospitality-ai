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

// API handler to fetch data from the database
export async function GET(req) {
  try {
    // Query the bookings table for data
    const result = await pool.query('SELECT * FROM bookings'); // Customize the query as needed

    // Return the data as JSON
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing query', error);

    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}