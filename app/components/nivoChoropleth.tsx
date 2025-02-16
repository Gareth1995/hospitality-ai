// import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// // Updated TopoJSON URL
// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// // Sample data
// const data = [
//   { country: "Czech Republic", modal_sentiment: "neutral" },
//   { country: "Estonia", modal_sentiment: "joy" },
//   { country: "Germany", modal_sentiment: null },
//   { country: "Ghana", modal_sentiment: "neutral" },
//   { country: "Italy", modal_sentiment: "neutral" },
//   { country: "Mauritius", modal_sentiment: "neutral" },
//   { country: "Namibia", modal_sentiment: "joy" },
//   { country: "South Africa", modal_sentiment: "joy" },
//   { country: "United Kingdom", modal_sentiment: null },
//   { country: "United States", modal_sentiment: "joy" },
//   { country: "Zimbabwe", modal_sentiment: "joy" },
// ];

// // Color mapping for sentiments
// const colorMap = {
//   joy: "#4ade80", // Green
//   neutral: "#fbbf24", // Yellow
//   null: "#d1d5db", // Gray
// };

// const ChoroplethMap = () => {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <ComposableMap
//         projection="geoMercator"
//         width={800}
//         height={500}
//         className="rounded-lg shadow-lg bg-white"
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const countryData = data.find(
//                 (item) => item.country === geo.properties.NAME_LONG
//               );
//               const sentiment = countryData ? countryData.modal_sentiment : null;
//               const fillColor = colorMap[sentiment] || colorMap.null;

//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill={fillColor}
//                   stroke="#FFF"
//                   strokeWidth={0.5}
//                   style={{
//                     default: { outline: "none" },
//                     hover: { fill: "#3b82f6", outline: "none" },
//                     pressed: { outline: "none" },
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// };

// export default ChoroplethMap;

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Updated TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Sample data
const data = [
  { country: "Czech Republic", modal_sentiment: "neutral" },
  { country: "Estonia", modal_sentiment: "joy" },
  { country: "Germany", modal_sentiment: null },
  { country: "Ghana", modal_sentiment: "neutral" },
  { country: "Italy", modal_sentiment: "neutral" },
  { country: "Mauritius", modal_sentiment: "neutral" },
  { country: "Namibia", modal_sentiment: "joy" },
  { country: "South Africa", modal_sentiment: "joy" },
  { country: "United Kingdom", modal_sentiment: null },
  { country: "United States", modal_sentiment: "joy" },
  { country: "Zimbabwe", modal_sentiment: "joy" },
];

// Color mapping for sentiments
const colorMap = {
  joy: "#4ade80", // Green
  neutral: "#fbbf24", // Yellow
  null: "#d1d5db", // Gray
};

const ChoroplethMap = () => {
  return (
    <div className="w-full h-[300px]"> {/* Constrain the height */}
      <ComposableMap
        projection="geoMercator"
        // className="rounded-lg shadow-lg bg-white"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryData = data.find(
                (item) => item.country === geo.properties.NAME_LONG
              );
              const sentiment = countryData ? countryData.modal_sentiment : null;
              const fillColor = colorMap[sentiment] || colorMap.null;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#3b82f6", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default ChoroplethMap;