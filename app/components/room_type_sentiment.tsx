'use client';

import React, { use, useEffect, useState} from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    Rectangle
} from "recharts";
import { useAuth } from "../context/authContext";

const RoomTypeSentiment: React.FC = () => {
    const { hotelId } = useAuth();
    const [ratingByRoom, setRatingByRoom] = useState([]);

    useEffect(() => {
        
        if (!hotelId) {
            console.log(`No hotelId for fetching rating by room fetch`);
            return;
        }

        // Fetch rating by date data
        const fetchRatingByRoom = async () => {
            try {
                const response = await fetch(`/api/rating-by-room?hotelId=${hotelId}`, {next: { revalidate: 21600 }});
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                setRatingByRoom(data);
                return data;
            } catch (err) {
                console.log(err.message); // Handle errors
                return [];
            }
        };
        fetchRatingByRoom();
    }, [hotelId]);

    // useEffect to print ratingByRoom data
    useEffect(() => {
        console.log(ratingByRoom);
    }, [ratingByRoom]);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={ratingByRoom}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tick={({ x, y, payload }) => {
                        const text = payload.value;
                        const chunkSize = 10;
                        
                        // Split text into chunks of 10 characters
                        const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];

                        return (
                            <text x={x} y={y} textAnchor="middle" fontSize={15}>
                                {chunks.map((chunk, index) => (
                                    <tspan x={x} dy={15} key={index}>{chunk}</tspan>
                                ))}
                            </text>
                        );
                    }} 
                />

                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average_rating" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RoomTypeSentiment;
