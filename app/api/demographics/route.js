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
export async function GET() {
  try {
    // Query the bookings table for data
    const result = await pool.query(`SELECT 
            group_type AS "group",
            SUM(stays_in_week_nights) AS value,
            SUM(stays_in_weekend_nights) AS total_weekend_nights,
            AVG(stays_in_week_nights) AS mu,  -- Mean of stays_in_week_nights
            STDDEV(stays_in_week_nights) AS sd,  -- Standard deviation of stays_in_week_nights
            COUNT(stays_in_week_nights) AS n  -- Count of stays_in_week_nights
        FROM (
            SELECT 
                CASE 
                    WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) > 0 OR (COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) > 3) THEN 'family'
                    WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) = 1 THEN 'single'
                    WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) = 2 THEN 'couple'
                END AS group_type,
                stays_in_week_nights,
                stays_in_weekend_nights
            FROM bookings
        ) AS subquery
        GROUP BY group_type;
    `); // Customize the query as needed

        // console.log('Query Result:', result.rows);

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