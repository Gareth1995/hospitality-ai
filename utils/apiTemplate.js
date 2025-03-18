// get average review rating grouped by reviewer_check_in_date
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Your DB connection pool
import redis from '@/utils/redis'; // Import the shared Redis client


export function ApiHandler(redisCacheKey, sqlCommand) {

    return async function GET(request) {
        
        // console.log('THIS IS THE API HANDLER BEING HIT', request.nextUrl);
        // Get hotelId from query parameters
        const hotelId = request.nextUrl.searchParams.get('hotelId');

        if (!hotelId) {
            return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
        }

        try {
            // const redisKey = `${redisCacheKey}_${hotelId}`;
            // // console.log('cached key: redisKey');
            // // Check if the data is available in Redis
            // const cachedData = await redis.get(`${redisCacheKey}_${hotelId}`);

            // if (cachedData) {
            // // console.log('Returning check-in ratings from Redis', cachedData);
            // return NextResponse.json(JSON.parse(cachedData));
            // }

            const result = await pool.query(sqlCommand, [hotelId]);    

            // If no data is found, return a 404 response
            if (result.rows.length === 0) {
                console.log(sqlCommand); // log sql command to see which command is bringing the error
                return NextResponse.json({ error: 'error fetching data for this hotel' }, { status: 404 });
            }

            // Store the result in Redis with a 24-hour TTL
            // await redis.setex(redisKey, 86400, JSON.stringify(result.rows));

            // Return the result
            // console.log(result.rows);
            return NextResponse.json(result.rows);

        } catch (error) {
            console.error('Error fetching data:', error);
            console.log(sqlCommand);
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
    }
}
