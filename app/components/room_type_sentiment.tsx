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

// Define TypeScript type for data
// interface ChartData {
//     name: string;
//     uv: number;
//     pv: number;
//     amt: number;
// }

// Sample data
// const data: ChartData[] = [
//     { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
//     { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
//     { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
//     { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
//     { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
//     { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
//     { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
// ];

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
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average_rating" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                {/* <Bar dataKey="average_rating" stackId="a" fill="#8884d8" /> */}
                {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" /> */}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RoomTypeSentiment;
