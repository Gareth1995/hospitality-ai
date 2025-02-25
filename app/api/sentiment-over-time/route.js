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
    const cacheKey = `hotel_${hotelId}_sentiment_over_time`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('Returning sentiment over time from Redis', cachedData);
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Query to get the average rating per check-in date
    const result = await pool.query(
        `SELECT 
            EXTRACT(YEAR FROM reviewer_check_in_date) AS year,
            TO_CHAR(reviewer_check_in_date, 'Mon') AS month,
            MODE() WITHIN GROUP (ORDER BY sentiment) AS modal_sentiment
        FROM reviews
        WHERE hotel_id = $1
        GROUP BY year, month, EXTRACT(MONTH FROM reviewer_check_in_date)
        ORDER BY year DESC, EXTRACT(MONTH FROM reviewer_check_in_date);`,
        [hotelId]
    );

    // If no data is found, return a 404 response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No data available for this hotel' }, { status: 404 });
    }

    // Store the result in Redis with a 24-hour TTL
    await redis.setex(cacheKey, 86400, JSON.stringify(result.rows));

    // Return the result
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching check-in ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
