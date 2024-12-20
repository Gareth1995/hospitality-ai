import { Pool } from 'pg';

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variables for security
  ssl: {
    rejectUnauthorized: false, // Set to true if you want strict SSL validation
  },
});


export async function GET() {
    
    try{
        // fetch all data from booking table
        const result = await pool.query('SELECT * FROM bookings');
        
        // Return the data as JSON
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch(error) {
        console.error(error);
        
        // Return an error response
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
  
    // Return the response as JSON
    // return new Response(JSON.stringify(booking_data), {
    //   status: 200,
    //   headers: { 'Content-Type': 'application/json' },
    // });
  }