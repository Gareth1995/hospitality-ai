'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

// draws multiple line chart for rating over time
const RatingLineChart = () => {

    const [ratingOvertimeData, setRatingOvertimeData] = useState([]);

    const { hotelId } = useAuth();

    // fetch rating over time data from database
    const fetchRatingData = async () => {
        try {
            const response = await fetch(`/api/rating-over-time?hotelId=${hotelId}`, {next: { revalidate: 21600 }});
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json(); // Parse JSON response
            return data;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message); // Handle errors
            } else {
                console.log('An unknown error occurred'); // Handle unknown errors
            }
            return [];
        }
    };

    useEffect(() => {

        if (!hotelId) {
            console.log(`No hotelId for fetching rating over time fetch`);
            return;
          }

        fetchRatingData().then(data => {
            setRatingOvertimeData(data)
        });
    }, [hotelId]);

    // extract unique years from the data if there is any data for that year
    const years = ratingOvertimeData.length > 0
        ? Object.keys(ratingOvertimeData[0]).filter((key) => key !== 'month' && ratingOvertimeData.some(item => item[key] !== null))
        : [];

    return (
        <div>
        <h2 className="text-xl font-bold text-center mb-4">Hotel Ratings Over Time</h2> 
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={ratingOvertimeData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 10]} />
                    <Tooltip />
                    <Legend />
                    {/* {years.map((year, index) => (
                    <Line key={year} type="monotone" dataKey={year} stroke={['#8884d8', '#82ca9d', '#ff7300'][index % 3]} strokeWidth={2} />
                    ))} */}
                    {years.map((year, index) => (
                        <Line
                            key={year}
                            type="monotone"
                            dataKey={year}
                            stroke={['#8884d8', '#82ca9d', '#ff7300'][index % 3]}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RatingLineChart