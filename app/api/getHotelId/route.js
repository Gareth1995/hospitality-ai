import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET(request) {
  const hotelName = request.nextUrl.searchParams.get('name');

  if (!hotelName) {
    return NextResponse.json({ error: 'Hotel name is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT hotel_id FROM hotels WHERE name = $1', [hotelName]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No hotel found with the given name' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hotel ID:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}