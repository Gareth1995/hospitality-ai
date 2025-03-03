// get average review rating grouped by reviewer_check_in_date
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool
import redis from '@/utils/redis'; // Import the shared Redis client

export async function GET(request) {
  
  // Get hotelId from query parameters
  const hotelId = request.nextUrl.searchParams.get('hotelId');

  if (!hotelId) {
    return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    // Check if the data is available in Redis
    const cacheKey = `hotel_${hotelId}_rating_by_room`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // console.log('Returning check-in ratings from Redis', cachedData);
      return NextResponse.json(JSON.parse(cachedData));
    }

    const result = await pool.query(
        `SELECT
            REPLACE(apartment_type, '-', '') AS name, 
            ROUND(AVG(review_rating), 2) AS average_rating
        FROM reviews
        WHERE hotel_id = $1 
        AND review_rating IS NOT NULL
        GROUP BY name
        ORDER BY name;`,
        [hotelId]
    );    

    // If no data is found, return a 404 response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No reviews available for this hotel' }, { status: 404 });
    }

    // Store the result in Redis with a 24-hour TTL
    await redis.setex(cacheKey, 86400, JSON.stringify(result.rows));

    // Return the result
    console.log(result.rows);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching rating by room data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
