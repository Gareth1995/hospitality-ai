'use client';

import React, { useEffect, useState} from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Rectangle
} from "recharts";
import { useAuth } from "../context/authContext";

const GroupTypeRating: React.FC = () => {
    const { hotelId } = useAuth();
    const [ratingbyGroup, setRatingbyGroup] = useState([]);

    useEffect(() => {
        if (!hotelId) {
            console.log(`No hotelId for fetching rating by room fetch`);
            return;
        }

        const fetchRatingbyGroup = async () => {
            try{
                const response = await fetch(`/api/get-rating-by-group?hotelId=${hotelId}`, {next: { revalidate: 21600 }});
                

                if (!response.ok) {
                    throw new Error('Failed to fetch group rating data');
                }
                const data = await response.json();
                setRatingbyGroup(data);

            } catch (error) {
                console.error('Error fetching rating by group:', error);
            }    
        };
        fetchRatingbyGroup();

    }, [hotelId]);

    useEffect(() => {
      
      return () => {
        console.log(ratingbyGroup);
      }
    }, [ratingbyGroup])

    return (
        <ResponsiveContainer width="100%" height={400} >
            <BarChart
                data={ratingbyGroup}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tick={({ x, y, payload }) => {
                        
                        const text = payload.value;
                        const chunkSize = 20;
                        
                        // Split text into chunks of 10 characters
                        const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];

                        return (
                            <text x={x} y={y} textAnchor="middle" fontSize={12} fill="grey">
                                {chunks.map((chunk, index) => (
                                    <tspan x={x} dy={15} key={index}>{chunk}</tspan>
                                ))}
                            </text>
                        );
                    } } 
                    interval={0}
                />

                <YAxis label={{ 
                    value: "Average Rating", 
                    angle: -90, 
                    position: "insideLeft", 
                    style: { textAnchor: "middle", fontSize: 15 } 
                    
                }}/>
                <Tooltip formatter={(value, name) => {
                    if (name === "average_rating") {
                        return [value, "Average Rating"]; // Change the label
                    }
                    return [value, name]; // Default case
                }} />
                <Bar dataKey="average_rating" fill="#8884d8" activeBar={<Rectangle stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
    );
};



export default GroupTypeRating;


