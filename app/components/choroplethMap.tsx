import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useEffect, useState, useRef } from "react";
import Tooltip from "./mapTooltip";
import ReviewModal from "./reviewTooltip";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revModalPositionX, setRevModalPositionX] = useState('50%');
  const [revModalPositionY, setRevModalPositionY] = useState('50%');
  const [revModalCountry, setRevModalCountry] = useState("");
  const [modalReviews, setModalReviews] = useState([]);

  const modalRef = useRef(null); // Reference for the modal

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

  // Handle mouse enter to show the tooltip
  const handleMouseEnter = (geo, evt) => {
    console.log(evt);
    const countryData = countrySentimentsRef.current.find(
      (item) => item.country === geo.properties.name
    );

    const countryName = geo.properties.name;
    const numRevs = countrynumReviewsRef.current[countryName] || "0";

    setTooltipData((prev) => ({
      ...prev,
      countryName,
      numReviews: numRevs,
      xPosition: evt.pageX + 10,
      yPosition: evt.pageY - 150,
      visible: true
    }));
  }

  // Handle mouse leave to hide the tooltip
  const handleMouseLeave = () => {
    setTooltipData({ ...tooltipData, visible: false });
  };

  // handle click on country event
  const handleCountryClick = (geo, evt) => {
    const countryName = geo.properties.name;
    console.log(`${countryName} has been clicked`);

    // Fetch detailed reviews for the clicked country
    fetch(`/api/country-reviews?country=${encodeURIComponent(countryName)}`)
    .then((response) => response.json())
    .then((reviews) => {
      console.log("Reviews for", countryName, reviews);
      setModalReviews(reviews);
      console.log('Modal Reviews:', modalReviews);

      // Calculate the position based on mouse click
      let newX = evt.clientX;
      let newY = evt.clientY;

      // Ensure modal stays within the right boundary of the screen
      const modalWidth = 300; // Adjust based on your modal size
      if (newX + modalWidth > window.innerWidth) {
        newX = window.innerWidth - modalWidth - 10; // 10px padding from the edge
      }

      // Ensure modal stays within the bottom boundary of the screen
      const modalHeight = 400; // Adjust based on your modal size
      if (newY + modalHeight > window.innerHeight) {
        newY = window.innerHeight - modalHeight - 10; // 10px padding from the edge
      }

      // Set modal position and open it
      setRevModalCountry(countryName);
      setRevModalPositionX(newX);
      setRevModalPositionY(newY);
      setIsModalOpen(true);
    })
    .catch((error) => console.error("Error fetching country reviews:", error));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalReviews([]);
  };

  return (
    <>
    {countrySentiments.length > 0
    ?
      (<ComposableMap
        projection="geoMercator"
        className="rounded-lg shadow-lg bg-[var(--card-bg-col)] h-full w-full"
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
                    onClick={(evt) => handleCountryClick(geo, evt)}
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

      {/* Review Modal */}
      <ReviewModal
        reviews={modalReviews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        positionX={revModalPositionX}
        positionY={revModalPositionY}
        country={revModalCountry}
      />
    </>
  );
};

export default ChoroplethMap;
