import { pool } from '@/lib/db'; // Your DB connection pool

// API handler to fetch booking data
export async function GET(req) {
   
  // Get the country from the query string using req.query
  const url = new URL(req.url); // Create a new URL object from the request URL
  const country = url.searchParams.get('country'); // Get the country parameter
  const hotelId = req.nextUrl.searchParams.get('hotelId');

  if (!country) {
    return new Response(JSON.stringify({ error: "Country is required" }), { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Query PostgreSQL for reviews where the country matches
    const result = await client.query(
      "SELECT reviewer_name, review_text, review_rating, sentiment FROM reviews WHERE country = $1 AND hotel_id = $2",
      [country, hotelId]
    );
    
    client.release(); // Release the client back to the pool

    return new Response(JSON.stringify(result.rows), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}