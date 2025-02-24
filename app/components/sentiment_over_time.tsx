// import React, { PureComponent } from 'react';
// import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data01 = [
//   { hour: '12a', index: 1, value: 170 },
//   { hour: '1a', index: 1, value: 180 },
//   { hour: '2a', index: 1, value: 150 },
//   { hour: '3a', index: 1, value: 120 },
//   { hour: '4a', index: 1, value: 200 },
//   { hour: '5a', index: 1, value: 300 },
//   { hour: '6a', index: 1, value: 400 },
//   { hour: '7a', index: 1, value: 200 },
//   { hour: '8a', index: 1, value: 100 },
//   { hour: '9a', index: 1, value: 150 },
//   { hour: '10a', index: 1, value: 160 },
//   { hour: '11a', index: 1, value: 170 },
//   { hour: '12a', index: 1, value: 180 },
//   { hour: '1p', index: 1, value: 144 },
//   { hour: '2p', index: 1, value: 166 },
//   { hour: '3p', index: 1, value: 145 },
//   { hour: '4p', index: 1, value: 150 },
//   { hour: '5p', index: 1, value: 170 },
//   { hour: '6p', index: 1, value: 180 },
//   { hour: '7p', index: 1, value: 165 },
//   { hour: '8p', index: 1, value: 130 },
//   { hour: '9p', index: 1, value: 140 },
//   { hour: '10p', index: 1, value: 170 },
//   { hour: '11p', index: 1, value: 180 },
// ];

// const data02 = [
//   { hour: '12a', index: 1, value: 160 },
//   { hour: '1a', index: 1, value: 180 },
//   { hour: '2a', index: 1, value: 150 },
//   { hour: '3a', index: 1, value: 120 },
//   { hour: '4a', index: 1, value: 200 },
//   { hour: '5a', index: 1, value: 300 },
//   { hour: '6a', index: 1, value: 100 },
//   { hour: '7a', index: 1, value: 200 },
//   { hour: '8a', index: 1, value: 100 },
//   { hour: '9a', index: 1, value: 150 },
//   { hour: '10a', index: 1, value: 160 },
//   { hour: '11a', index: 1, value: 160 },
//   { hour: '12a', index: 1, value: 180 },
//   { hour: '1p', index: 1, value: 144 },
//   { hour: '2p', index: 1, value: 166 },
//   { hour: '3p', index: 1, value: 145 },
//   { hour: '4p', index: 1, value: 150 },
//   { hour: '5p', index: 1, value: 160 },
//   { hour: '6p', index: 1, value: 180 },
//   { hour: '7p', index: 1, value: 165 },
//   { hour: '8p', index: 1, value: 130 },
//   { hour: '9p', index: 1, value: 140 },
//   { hour: '10p', index: 1, value: 160 },
//   { hour: '11p', index: 1, value: 180 },
// ];

// const parseDomain = () => [
//   0,
//   Math.max(
//     Math.max.apply(
//       null,
//       data01.map((entry) => entry.value),
//     ),
//     Math.max.apply(
//       null,
//       data02.map((entry) => entry.value),
//     ),
//   ),
// ];

// export default class Example extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/multi-bubble-chart-tcqkqx';

//   renderTooltip = (props) => {
//     const { active, payload } = props;

//     if (active && payload && payload.length) {
//       const data = payload[0] && payload[0].payload;

//       return (
//         <div
//           style={{
//             backgroundColor: '#fff',
//             border: '1px solid #999',
//             margin: 0,
//             padding: 10,
//           }}
//         >
//           <p>{data.hour}</p>
//           <p>
//             <span>value: </span>
//             {data.value}
//           </p>
//         </div>
//       );
//     }

//     return null;
//   };

//   render() {
//     const domain = parseDomain();
//     const range = [16, 225];

//     return (
//       <div style={{ width: '100%' }}>
//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               name="sunday"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Sunday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data01} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Monday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data02} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Tuesday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data01} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Wednesday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data02} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Thursday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data01} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Friday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data02} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               name="hour"
//               interval={0}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Saturday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data01} fill="#8884d8" />
//           </ScatterChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   }
// }

import React, { PureComponent } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { year: 2025, month: "Jan", sentiment: "joy" },
    { year: 2025, month: "Feb", sentiment: "joy" },
    { year: 2024, month: "Jan", sentiment: "joy" },
    { year: 2024, month: "Feb", sentiment: "neutral" },
    { year: 2024, month: "Mar", sentiment: "disgust" },
    { year: 2024, month: "Apr", sentiment: "joy" },
    { year: 2024, month: "May", sentiment: "joy" },
    { year: 2024, month: "Jun", sentiment: "joy" },
    { year: 2024, month: "Jul", sentiment: "neutral" },
    { year: 2024, month: "Aug", sentiment: "joy" },
    { year: 2024, month: "Sep", sentiment: "joy" },
    { year: 2024, month: "Oct", sentiment: "joy" },
    { year: 2024, month: "Nov", sentiment: "joy" },
    { year: 2024, month: "Dec", sentiment: "joy" },
    { year: 2023, month: "Aug", sentiment: "joy" },
    { year: 2023, month: "Sep", sentiment: "joy" },
    { year: 2023, month: "Oct", sentiment: "joy" },
    { year: 2023, month: "Nov", sentiment: "joy" },
    { year: 2023, month: "Dec", sentiment: "joy" },
];

const sentimentEmojis = {
    joy: "😊",
    neutral: "😐",
    disgust: "🤢",
};

const renderCustomScatter = (props) => {
    const { cx, cy, payload } = props;
    return (
        <text
            x={cx}
            y={cy}
            textAnchor="middle"
            fontSize={20}
            dominantBaseline="central"
        >
            {sentimentEmojis[payload.sentiment]}
        </text>
    );
};

export default class SentimentScatterChart extends PureComponent {


    renderTooltip = ({ active, payload }) => {
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

    render() {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="category" dataKey="month" name="Month" />
                    <YAxis type="category" dataKey="year" name="Year" />
                    <Tooltip content={this.renderTooltip} />
                    <Scatter data={data} shape={renderCustomScatter} />
                </ScatterChart>
            </ResponsiveContainer>
        );
    }
}
