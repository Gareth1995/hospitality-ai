import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool

export async function POST(request) {
  try {
    const { username, email, hotel_id } = await request.json();

    // Validate input
    if (!username || !email || !hotel_id) {
      return NextResponse.json(
        { error: 'Username, email, and hotel ID are required' },
        { status: 400 }
      );
    }

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO users (user_name, email, hotel_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hotel_id]
    );

    // Return the newly created user
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {

    // Handle unique constraint violation (email already exists)
    if (error.code === '23505') {
        return NextResponse.json(
            { error: 'User already exists' },
            { status: 409 } // 409 Conflict is appropriate for duplicate resource requests
        );
    }
    
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}