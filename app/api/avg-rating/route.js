// get counts of visitors per country
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET(request) {
  
  // console.log(request.nextUrl);
  // Get hotelId from query parameters
  const hotelId = request.nextUrl.searchParams.get('hotelId');

  if (!hotelId) {
    return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    // const hotelId = 'e1ada55f-000c-4991-9527-f72362cb6e80'; // Replace with dynamic value if needed
    const result = await pool.query(
      `SELECT hotel_id, AVG(review_rating) AS average_rating
        FROM reviews
        WHERE hotel_id = $1
        GROUP BY hotel_id`,
      [hotelId]
    );
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching average rating:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}