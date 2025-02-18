import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET(request) {
  // console.log(request.nextUrl)
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No user found matching the criteria' }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
