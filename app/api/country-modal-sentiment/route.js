import { pool } from '@/lib/db'; // Your DB connection pool
import redis from '@/utils/redis'; // Import the shared Redis client
import { NextResponse } from 'next/server';

// API handler to fetch modal sentiment per country
export async function GET(req) {

  // get hotel id
  const hotelId = req.nextUrl.searchParams.get('hotelId');

  if (!hotelId) {
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {

    // Check if the data is available in Redis
    const cachedData = await redis.get(`hotel_${hotelId}_country_modal_sentiment`);
    if (cachedData) {
      // If the data exists in Redis, return it as JSON
      console.log('Returning country modal sentiment data from Redis');
      return NextResponse.json(JSON.parse(cachedData));
    }    

    // If not in Redis, fetch from PostgreSQL database
    const result = await pool.query(`
      SELECT country, mode() WITHIN GROUP (ORDER BY sentiment) AS modal_sentiment
      FROM reviews
      WHERE hotel_id = $1
      GROUP BY country`,
      [hotelId]
    );

    // If the result is empty, return a 404 response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'modal sentiment per country data not available' }, { status: 404 });
    }

    // Store the fetched data in Redis with a 24-hour TTL
    await redis.setex(`hotel_${hotelId}_country_modal_sentiment`, 86400, JSON.stringify(result.rows));

    // return data
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
