import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useEffect, useState, useRef } from "react";
import ChoroplethMapLegend from "./legend";

// Updated TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Color mapping for sentiments
const colorMap = {
  anger: "#e74c3c",      // Red 😡
  disgust: "#8e44ad",   // Purple 🤢
  fear: "#34495e",      // Dark Blue-Gray 😨
  joy: "#80ff00",       // Yellow 😀
  neutral: "#666600",   // Gray 😐
  sadness: "#3498db",   // Blue 😭
  surprise: "#e67e22",  // Orange 😲
  null: '#808080'
};

const ChoroplethMap = () => {
  // variable to hold <country; count> values
  const [countrySentiments, setcountrySentiments] = useState([]);
  const [numReviews, setnumReviews] = useState({});
  const countrySentimentsRef = useRef([]); // Store latest countryCounts in a ref
  const countrynumReviewsRef = useRef({});

  // Fetch the country counts from the API
  useEffect(() => {
    // fetch the modal country sentiment
    fetch("/api/country-modal-sentiment")
      .then((response) => response.json())
      .then((data: { country: string; modal_sentiment?: string }[]) => {
        console.log("fetched sentiment data:", data);
        
        // Convert any "null" modal_sentiment to "neutral"
        const updatedData = data.map((item) => ({
          ...item,
          modal_sentiment: item.modal_sentiment === null ? "neutral" : item.modal_sentiment,
        }));

        console.log("Updated Sentiment Data:", updatedData);
        setcountrySentiments(updatedData); // set array of country - count dictionaries
        countrySentimentsRef.current = updatedData; // Update ref
        setTimeout(() => console.log("Sentiment Ref:", countrySentimentsRef.current), 100);
      })

      .catch((error) => console.error("Error fetching country counts:", error));

    // fetch the number of reviews per country
    fetch("/api/country-counts")
      .then((response) => response.json())
      .then((data: { country: string; count?: string }[]) => {
        // console.log("fetched number review data:", data);

        // Convert array to object { countryName: sentiment }
        const c = data.reduce<Record<string, string>>((acc, item) => {
          acc[item.country] = item.count || "0"; // Map country name to sentiment
          return acc;
        }, {});

        // console.log("Processed number review data:", c);

        setnumReviews(c); // set array of country - count dictionaries
        countrynumReviewsRef.current = c; // Update ref
        // setTimeout(() => console.log("Updated state:", countrynumReviewsRef.current), 100); // Delay to check if state updates
      })
      .catch((error) => console.error("Error fetching country counts:", error));

  }, []);

  return (
    <>
      <ComposableMap
        projection="geoMercator"
        className="rounded-lg shadow-lg bg-white h-full w-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryData = countrySentimentsRef.current.find(
                (item) => item.country === geo.properties.name
              );
              const sentiment = countryData ? countryData.modal_sentiment : null;
              // const fillColor = colorMap[sentiment] || colorMap.null;
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
    </>
  );
};

export default ChoroplethMap;