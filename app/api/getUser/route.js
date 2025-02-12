import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET(request) {
  // console.log(request.nextUrl)
  const username = request.nextUrl.searchParams.get('username');
  const email = request.nextUrl.searchParams.get('email');
  console.log(username, email);

  if (!username || !email) {
    return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_name = $1 AND email = $2`,
      [username, email]
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
