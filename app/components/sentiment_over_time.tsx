// import React, { PureComponent } from "react";
// import {
//     ScatterChart,
//     Scatter,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// const data = [
//     { year: 2025, month: "Jan", sentiment: "joy" },
//     { year: 2025, month: "Feb", sentiment: "joy" },
//     { year: 2024, month: "Jan", sentiment: "joy" },
//     { year: 2024, month: "Feb", sentiment: "neutral" },
//     { year: 2024, month: "Mar", sentiment: "disgust" },
//     { year: 2024, month: "Apr", sentiment: "joy" },
//     { year: 2024, month: "May", sentiment: "joy" },
//     { year: 2024, month: "Jun", sentiment: "joy" },
//     { year: 2024, month: "Jul", sentiment: "neutral" },
//     { year: 2024, month: "Aug", sentiment: "joy" },
//     { year: 2024, month: "Sep", sentiment: "joy" },
//     { year: 2024, month: "Oct", sentiment: "joy" },
//     { year: 2024, month: "Nov", sentiment: "joy" },
//     { year: 2024, month: "Dec", sentiment: "joy" },
//     { year: 2023, month: "Aug", sentiment: "joy" },
//     { year: 2023, month: "Sep", sentiment: "joy" },
//     { year: 2023, month: "Oct", sentiment: "joy" },
//     { year: 2023, month: "Nov", sentiment: "joy" },
//     { year: 2023, month: "Dec", sentiment: "joy" },
// ];

// const sentimentEmojis = {
//     joy: "😊",
//     neutral: "😐",
//     disgust: "🤢",
// };

// const renderCustomScatter = (props) => {
//     const { cx, cy, payload } = props;
//     return (
//         <text
//             x={cx}
//             y={cy}
//             textAnchor="middle"
//             fontSize={20}
//             dominantBaseline="central"
//         >
//             {sentimentEmojis[payload.sentiment]}
//         </text>
//     );
// };

// export default class SentimentScatterChart extends PureComponent {


//     renderTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const { year, month, sentiment } = payload[0].payload;
//             return (
//                 <div className="custom-tooltip" style={{ background: "white", padding: "5px", border: "1px solid #ccc" }}>
//                     <p>{`${month} ${year}: ${sentimentEmojis[sentiment]} (${sentiment})`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     render() {
//         return (
//             <ResponsiveContainer width="100%" height={400}>
//                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                     <XAxis type="category" dataKey="month" name="Month" />
//                     <YAxis type="category" dataKey="year" name="Year" />
//                     <Tooltip content={this.renderTooltip} />
//                     <Scatter data={data} shape={renderCustomScatter} />
//                 </ScatterChart>
//             </ResponsiveContainer>
//         );
//     }
// }

'use client';

import React, { useState, useEffect } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/authContext";


const sentimentEmojis = {
    joy: "😊",
    neutral: "😐",
    disgust: "🤢",
};

// Custom scatter point renderer
const renderCustomScatter = (props) => {
    const { cx, cy, payload } = props;
    return (
        <text x={cx} y={cy} textAnchor="middle" fontSize={20} dominantBaseline="central">
            {sentimentEmojis[payload.sentiment]}
        </text>
    );
};

const SentimentScatterChart = () => {
    const [data, setData] = useState([]);
    const { hotelId } = useAuth();


    // Fetch data from the database when the component mounts
    useEffect(() => {
        
        if (!hotelId) {
            console.log(`No hotelId for sentiment over time fetch`);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/sentiment-over-time?hotelId=${hotelId}`);
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const result = await response.json();
                setData(result); // Store data in state
                               
            } catch (error) {
                console.error("Error fetching sentiments over time:", error);
            }
        };

        fetchData();
    }, [hotelId]); 

    useEffect(() => {
        console.log("Updated data:", data);
    }, [data]);  // Runs every time `data` is updated 

    // Tooltip customization
    const renderTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { year, month, sentiment } = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{ background: "white", padding: "5px", border: "1px solid #ccc" }}>
                    <p>{`${month} ${year}: ${sentimentEmojis[sentiment]} (${sentiment})`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="category" dataKey="month" name="Month" />
                <YAxis type="category" dataKey="year" name="Year" />
                <Tooltip content={renderTooltip} />
                <Scatter data={data} shape={renderCustomScatter} />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default SentimentScatterChart;
