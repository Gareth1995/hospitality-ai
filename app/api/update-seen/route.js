// import { NextResponse } from 'next/server';
// import { pool } from '@/lib/db'; // Your DB connection pool
// import redis from '@/utils/redis'; // Import the shared Redis client

// export async function PUT(request) {
//     try {
//         const hotelId = request.nextUrl.searchParams.get('hotelId');

//         if (!hotelId) {
//             return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
//         }

//         // Update the 'seen' status in the database
//         const result = await pool.query(
//             `UPDATE reviews SET seen = TRUE WHERE hotel_id = $1 RETURNING *`,
//             [hotelId]
//         );

//         if (result.rowCount === 0) {
//             return NextResponse.json({ error: 'No reviews updated' }, { status: 404 });
//         }

//         // Invalidate the cached bad review data (if applicable)
//         await redis.del(`bad_reviews_${hotelId}`);

//         return NextResponse.json({
//             message: `Updated ${result.rowCount} reviews to seen`,
//             updatedReviews: result.rows
//         });

//     } catch (error) {
//         console.error('Error updating seen status:', error);
//         return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import redis from '@/utils/redis';

export async function PUT(request) {
    try {
        const body = await request.json(); // Read request body once and store it
        console.log(body);
        const { hotelId, reviewer_name, negative_review, sentiment } = body;

        if (!hotelId || !reviewer_name || !negative_review || !sentiment) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE reviews 
             SET seen = TRUE 
             WHERE hotel_id = $1 
             AND reviewer_name = $2 
             AND negative_review = $3 
             AND sentiment = $4 
             RETURNING *`,
            [hotelId, reviewer_name, negative_review, sentiment]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // delete cache for bad review data
        await redis.del(`hotel_${hotelId}_country_counts`);

        return NextResponse.json({ message: "Review marked as seen", updatedReview: result.rows[0] });

    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}
