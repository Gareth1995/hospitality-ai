import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useEffect, useState, useRef } from "react";
import Tooltip from "./mapTooltip";

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
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const [tooltipData, setTooltipData] = useState({
    countryName: "",
    numReviews: 0,
    xPosition: 0,
    yPosition: 0,
    visible: false
  });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

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
        setTimeout(() => console.log("Number of reviews:", countrynumReviewsRef.current), 100); // Delay to check if state updates
      })
      .catch((error) => console.error("Error fetching country counts:", error));

  }, []);

  // Handle mouse enter to show the tooltip
  const handleMouseEnter = (geo, evt) => {
    const countryData = countrySentimentsRef.current.find(
      (item) => item.country === geo.properties.name
    );
    const countryName = geo.properties.name;
    const numRevs = countrynumReviewsRef.current[countryName] || "0";
    console.log(countryName, numRevs);

    setTooltipData((prev) => ({
      ...prev,
      countryName,
      numReviews: numRevs,
      xPosition: evt.clientX - 30,
      yPosition: evt.clientY - 30,
      visible: true
    }));
  }

  // Handle mouse leave to hide the tooltip
  const handleMouseLeave = () => {
    setTooltipData({ ...tooltipData, visible: false });
  };

  return (
    <>
    {countrySentiments.length > 0
    ?
      (<ComposableMap
        projection="geoMercator"
        className="rounded-lg shadow-lg bg-white h-full w-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
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
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>

      </ComposableMap>) :
      <div className="flex items-center justify-center h-full w-full">
        <p>Loading...</p>
      </div> }

      {/* Tooltip Overlay */}
      {tooltipData.visible && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <Tooltip
            countryName={tooltipData.countryName}
            numReviews={tooltipData.numReviews}
            xPosition={tooltipData.xPosition}
            yPosition={tooltipData.yPosition}
          />
        </div>
      )}
    </>
  );
};

export default ChoroplethMap;
