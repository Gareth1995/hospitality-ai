// get counts of visitors per country
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT country, COUNT(*) AS count
      FROM reviews
      GROUP BY country
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching country counts:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}