import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import redis from '@/utils/redis';

export async function PUT(request) {
    try {
        const body = await request.json(); // Read request body once and store it
        console.log(body);
        let { hotelId, reviewer_name, negative_review, sentiment } = body;

        if (!hotelId || !reviewer_name || !sentiment) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE reviews 
             SET seen = TRUE 
             WHERE hotel_id = $1 
             AND reviewer_name = $2 
             AND (negative_review IS NULL OR negative_review = $3)
             AND sentiment = $4 
             RETURNING *`,
            [hotelId, reviewer_name, negative_review, sentiment]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // delete cache for bad review data
        await redis.del(`bad_reviews_${hotelId}`);

        return NextResponse.json({ message: "Review marked as seen", updatedReview: result.rows[0] });

    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}
