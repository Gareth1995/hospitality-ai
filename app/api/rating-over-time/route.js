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
    const cacheKey = `hotel_${hotelId}_checkin_ratings`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('Returning check-in ratings from Redis', cachedData);
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Query to get the average rating per check-in date
    const result = await pool.query(
        `WITH monthly_ratings AS (
        SELECT 
            TO_CHAR(reviewer_check_in_date, 'Mon') AS month,
            EXTRACT(YEAR FROM reviewer_check_in_date) AS year,
            ROUND(AVG(review_rating), 2) AS avg_rating
        FROM reviews
        WHERE hotel_id = $1
        GROUP BY month, year
        )
        SELECT 
            month,
            COALESCE(MAX(CASE WHEN year = 2022 THEN avg_rating END), NULL) AS "2022",
            COALESCE(MAX(CASE WHEN year = 2023 THEN avg_rating END), NULL) AS "2023",
            COALESCE(MAX(CASE WHEN year = 2024 THEN avg_rating END), NULL) AS "2024"
        FROM monthly_ratings
        GROUP BY month
        ORDER BY TO_DATE(month, 'Mon');`,
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
    console.error('Error fetching check-in ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
