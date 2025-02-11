// get counts of visitors per country
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function GET() {
    try {
      const result = await pool.query(
        `SELECT sentiment, COUNT(sentiment) as count
        FROM reviews
        WHERE hotel_id = 'e1ada55f-000c-4991-9527-f72362cb6e80'
        GROUP BY sentiment
        ORDER BY count DESC
        LIMIT 1`
      );
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
  }