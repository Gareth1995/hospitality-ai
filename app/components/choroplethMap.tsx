import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useEffect, useState, useRef, useCallback } from "react";
import Tooltip from "./mapTooltip";
import ReviewModal from "./reviewTooltip";
import { useAuth } from "../context/authContext";
import { Spinner } from "@heroui/react";

// Updated TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Color mapping for sentiments
const colorMap = {
  anger: "#e74c3c",      // Red 😡
  disgust: "#8e44ad",    // Purple 🤢
  fear: "#34495e",       // Dark Blue-Gray 😨
  joy: "#80ff00",        // Yellow 😀
  neutral: "#666600",    // Gray 😐
  sadness: "#3498db",    // Blue 😭
  surprise: "#e67e22",   // Orange 😲
  null: '#808080'
};

const ChoroplethMap = () => {
  const [countrySentiments, setcountrySentiments] = useState([]);
  const [numReviews, setnumReviews] = useState({});
  const countrySentimentsRef = useRef([]);
  const countrynumReviewsRef = useRef({});
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const { hotelId } = useAuth(); // Get hotelId from context
  const [loading, setLoading] = useState(true);

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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch reviews when hotelId and country are ready to use in query
  useEffect(() => {
    if (!selectedCountry || !hotelId) return;

    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const response = await fetch(
          `/api/country-reviews?country=${encodeURIComponent(selectedCountry)}&hotelId=${hotelId}`
        );
        const reviews = await response.json();
        setModalReviews(reviews);
      } catch (error) {
        console.error("Error fetching country reviews:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [selectedCountry, hotelId]);

  // Fetch modal sentiment for a country and number of reviews per country
  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    // fetch the modal country sentiment
    fetch(`/api/country-modal-sentiment?hotelId=${hotelId}`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((item) => ({
          ...item,
          modal_sentiment: item.modal_sentiment === null ? "neutral" : item.modal_sentiment,
        }));
        setcountrySentiments(updatedData);
        countrySentimentsRef.current = updatedData;
      })
      .catch((error) => console.error("Error fetching country counts:", error));

    // fetch the number of reviews per country
    fetch(`/api/country-counts?hotelId=${hotelId}`)
      .then((response) => response.json())
      .then((data) => {
        const c = data.reduce((acc, item) => {
          acc[item.country] = item.count || "0";
          return acc;
        }, {});
        setnumReviews(c);
        countrynumReviewsRef.current = c;
      })
      .catch((error) => console.error("Error fetching country counts:", error));
  }, [hotelId]);


  const handleMoveEnd = useCallback((position) => {
    // Delay the update to avoid direct updates during render
    setTimeout(() => {
      setPosition(position);
    }, 0);
  }, []);

  const handleMouseEnter = (geo, evt) => {
    const countryData = countrySentimentsRef.current.find(
      (item) => item.country === geo.properties.name
    );

    const countryName = geo.properties.name === "United States of America"
      ? "United States"
      : geo.properties.name;
    const numRevs = countrynumReviewsRef.current[countryName] || "0";

    setTooltipData((prev) => ({
      ...prev,
      countryName,
      numReviews: numRevs,
      xPosition: evt.pageX + 10,
      yPosition: evt.pageY - 150,
      visible: true
    }));
  };

  const handleMouseLeave = () => {
    setTooltipData({ ...tooltipData, visible: false });
  };

  const handleCountryClick = (geo, evt) => {
    const countryName = geo.properties.name === "United States of America"
      ? "United States"
      : geo.properties.name;
    setSelectedCountry(countryName);

    let newX = evt.clientX;
    let newY = evt.clientY;

    const modalWidth = 300;
    if (newX + modalWidth > window.innerWidth) {
      newX = window.innerWidth - modalWidth - 10;
    }

    const modalHeight = 400;
    if (newY + modalHeight > window.innerHeight) {
      newY = window.innerHeight - modalHeight - 10;
    }

    setRevModalCountry(countryName);
    setRevModalPositionX(newX);
    setRevModalPositionY(newY);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalReviews([]);
    setSelectedCountry(null);
  };

  return (
    <>
      {countrySentiments.length > 0 ? (
        <ComposableMap
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
                  const countryName = geo.properties.name === "United States of America"
                    ? "United States"
                    : geo.properties.name;
                  const countryData = countrySentimentsRef.current.find(
                    (item) => item.country === countryName
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
        </ComposableMap>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <Spinner />
        </div>
      )}

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
        isLoading={reviewLoading}
      />
    </>
  );
};

export default ChoroplethMap;
