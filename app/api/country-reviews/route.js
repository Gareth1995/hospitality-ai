import { pool } from '@/lib/db'; // Your DB connection pool
import redis from '@/utils/redis'; // Import the shared Redis client
import { NextResponse } from 'next/server';

// API handler to fetch booking data
export async function GET(req) {
   
  // Get the country from the query string using req.query
  const url = new URL(req.url); // Create a new URL object from the request URL
  const country = url.searchParams.get('country'); // Get the country parameter
  const hotelId = req.nextUrl.searchParams.get('hotelId');

  if (!country | !hotelId) {
    return new Response(JSON.stringify({ error: "Country and hotel ID is required" }), { status: 400 });
  }

  try {

    // Check if the data is available in Redis
    // const cachedData = await redis.get(`hotel_${hotelId}_reviews_by_country_${country}`);
    // if (cachedData) {
    //   // If the data exists in Redis, return it as JSON
    //   console.log('Returning reviews by country from Redis');
    //   return NextResponse.json(JSON.parse(cachedData));
    // }

    // If not in Redis, fetch from PostgreSQL database
    const result = await pool.query(
      "SELECT reviewer_name, review_text, review_rating, sentiment FROM reviews WHERE country = $1 AND hotel_id = $2",
      [country, hotelId]
    );
    
    // If the result is empty, return a 404 response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Hotel reviews by country not available' }, { status: 404 });
    }

    // Store the fetched data in Redis with a 24-hour TTL
    // await redis.setex(`hotel_${hotelId}_reviews_by_country_${country}`, 86400, JSON.stringify(result.rows));

    // Return the data
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}