// get counts of visitors per country
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool
import redis from '@/utils/redis'; // Import the shared Redis client

export async function GET(request) {
  
  // console.log(request.nextUrl);
  // Get hotelId from query parameters
  const hotelId = request.nextUrl.searchParams.get('hotelId');

  if (!hotelId) {
    return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    
    // Check if the data is available in Redis
    const cachedData = await redis.get(`hotel_${hotelId}_rating`);
    if (cachedData) {
      // If the data exists in Redis, return it as JSON
      console.log('Returning average rating from Redis');
      return NextResponse.json(JSON.parse(cachedData));
    }

    const result = await pool.query(
      `SELECT hotel_id, ROUND(AVG(review_rating), 2) AS average_rating
       FROM reviews
       WHERE hotel_id = $1
       GROUP BY hotel_id`,
      [hotelId]
    );

    // If the result is empty, return a 404 response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Hotel not found or no reviews available' }, { status: 404 });
    }

    // Store the fetched data in Redis with a 24-hour TTL
    await redis.setex(`hotel_${hotelId}_rating`, 86400, JSON.stringify(result.rows));

    // Return the data
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching average rating:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}