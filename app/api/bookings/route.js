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

// API handler to fetch booking data
export async function GET(req) {
  try {
    // Query the bookings table for data
    const result = await pool.query(`SELECT
        CONCAT(
        arrival_date_year, '-', 
        CASE arrival_date_month
          WHEN 'January' THEN '01'
          WHEN 'February' THEN '02'
          WHEN 'March' THEN '03'
          WHEN 'April' THEN '04'
          WHEN 'May' THEN '05'
          WHEN 'June' THEN '06'
          WHEN 'July' THEN '07'
          WHEN 'August' THEN '08'
          WHEN 'September' THEN '09'
          WHEN 'October' THEN '10'
          WHEN 'November' THEN '11'
          WHEN 'December' THEN '12'
        END, '-', arrival_date_day_of_month) AS formatted_date,
      COUNT(*) AS count
      FROM bookings
      GROUP BY
      formatted_date
      ORDER BY
      formatted_date`); // Customize the query as needed

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