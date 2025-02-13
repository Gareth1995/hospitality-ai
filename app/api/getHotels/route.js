import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET() {
  try {
    const result = await pool.query('SELECT DISTINCT name FROM hotels');
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No hotels found' }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching hotel names:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}