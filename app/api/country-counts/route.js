// get counts of visitors per country
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET(request) {

  // console.log(request.nextUrl);
	const hotelId = request.nextUrl.searchParams.get('hotelId');

	if (!hotelId) {
		return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
	}

  try {
    const result = await pool.query(`
      SELECT country, COUNT(*) AS count
      FROM reviews
      WHERE hotel_id = $1
      GROUP BY country
    `, [hotelId]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching country counts:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}