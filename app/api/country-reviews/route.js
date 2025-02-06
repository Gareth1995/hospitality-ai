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
   
   // Get the country from the query string using req.query
  //  const { country } = req.query;  // Access query parameters like this
  const url = new URL(req.url); // Create a new URL object from the request URL
  const country = url.searchParams.get('country'); // Get the country parameter

  if (!country) {
    return new Response(JSON.stringify({ error: "Country is required" }), { status: 400 });
  }

  try {
    console.log("Trying to pull country review data");
    const client = await pool.connect();

    // Query PostgreSQL for reviews where the country matches
    const result = await client.query(
      "SELECT reviewer_name, review_text, review_rating FROM reviews WHERE country = $1",
      [country]
    );
    
    console.log("Here is the country-review result:", result);
    client.release(); // Release the client back to the pool

    return new Response(JSON.stringify(result.rows), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


//   try {
//     // Query the bookings table for data
//     const result = await pool.query(`SELECT 
//             group_type AS "group",
//             SUM(stays_in_week_nights) AS value,
//             SUM(stays_in_weekend_nights) AS total_weekend_nights,
//             AVG(stays_in_week_nights) AS mu,  -- Mean of stays_in_week_nights
//             STDDEV(stays_in_week_nights) AS sd,  -- Standard deviation of stays_in_week_nights
//             COUNT(stays_in_week_nights) AS n  -- Count of stays_in_week_nights
//         FROM (
//             SELECT 
//                 CASE 
//                     WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) > 0 OR (COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) > 3) THEN 'family'
//                     WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) = 1 THEN 'single'
//                     WHEN COALESCE(NULLIF(children, 'NA')::INTEGER, 0) = 0 AND COALESCE(adults, 0) = 2 THEN 'couple'
//                 END AS group_type,
//                 stays_in_week_nights,
//                 stays_in_weekend_nights
//             FROM bookings
//         ) AS subquery
//         GROUP BY group_type;
//     `); // Customize the query as needed

//         // console.log('Query Result:', result.rows);

//     // Return the data as JSON
//     return new Response(JSON.stringify(result.rows), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error executing query', error);

//     // Return an error response if something goes wrong
//     return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }