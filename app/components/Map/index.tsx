"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import worldGeoJson from "../../data/world.geo.json"; // importing world map
import L from "leaflet"; // Import Leaflet for adding custom controls
import dynamic from "next/dynamic";

const ChoroplethMap = () => {
  // variable to hold <country; count> values
  const [countrySentiments, setcountrySentiments] = useState({});
  const [numReviews, setnumReviews] = useState({});
  const countrySentimentsRef = useRef({}); // Store latest countryCounts in a ref
  const countrynumReviewsRef = useRef({});

  // Fetch the country counts from the API
  useEffect(() => {
    // fetch the modal country sentiment
    fetch("/api/country-modal-sentiment")
      .then((response) => response.json())
      .then((data: { country: string; modal_sentiment?: string }[]) => {
        console.log("fetched data:", data);

        // Convert array to object { countryName: sentiment }
        const sentiments = data.reduce<Record<string, string>>((acc, item) => {
          acc[item.country] = item.modal_sentiment || 'neutral'; // Map country name to sentiment
          return acc;
        }, {});

        console.log("Processed Sentiments:", sentiments);

        setcountrySentiments(sentiments); // set array of country - count dictionaries
        countrySentimentsRef.current = sentiments; // Update ref
        // setTimeout(() => console.log("Updated state:", countryCountsRef.current), 100); // Delay to check if state updates
      })
      .catch((error) => console.error("Error fetching country counts:", error));

      // fetch the number of reviews per country
      fetch("/api/country-counts")
      .then((response) => response.json())
      .then((data: { country: string; count?: string }[]) => {
        console.log("fetched data:", data);

        // Convert array to object { countryName: sentiment }
        const c = data.reduce<Record<string, string>>((acc, item) => {
          acc[item.country] = item.count || "0"; // Map country name to sentiment
          return acc;
        }, {});

        console.log("Processed Counts:", c);

        setnumReviews(c); // set array of country - count dictionaries
        countrynumReviewsRef.current = c; // Update ref
        setTimeout(() => console.log("Updated state:", countrynumReviewsRef.current), 100); // Delay to check if state updates
      })
      .catch((error) => console.error("Error fetching country counts:", error));

  }, []);

  const sentimentColors = {
    anger: "#e74c3c",      // Red 😡
    disgust: "#8e44ad",   // Purple 🤢
    fear: "#34495e",      // Dark Blue-Gray 😨
    joy: "#80ff00",       // Yellow 😀
    neutral: "#666600",   // Gray 😐
    sadness: "#3498db",   // Blue 😭
    surprise: "#e67e22",  // Orange 😲
  };

  const getColor = (sentiment) => sentimentColors[sentiment] || "#bdc3c7"; // Default grey for missing data

  // Styling function for each country in the GeoJSON
  const style = (feature) => {
    const countryCode = feature.properties.admin; // calling name property of world map
    const sent = countrySentiments[countryCode] || 0;

    if (!sent) {
      // Return a transparent style for countries with no data
      return {
        fillColor: "transparent",
        weight: 1,
        opacity: 0,
        color: "white",
        dashArray: "3",
        fillOpacity: 0,
      };
    }

    return {
      fillColor: getColor(sent),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  // Function to create a legend for sentiment categories
  const Legend = () => {
    const map = useMap(); // Get the map instance

    useEffect(() => {
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");

        // Add a header to the legend
        div.innerHTML += "<h4>Sentiment Legend</h4>";

        // Define sentiment categories and colors
        const sentiments = {
          anger: "#e74c3c",      // Red 😡
          disgust: "#8e44ad",   // Purple 🤢
          fear: "#34495e",      // Dark Blue-Gray 😨
          joy: "#80ff00",       // Yellow 😀
          neutral: "#666600",   // Gray 😐
          sadness: "#3498db",   // Blue 😭
          surprise: "#e67e22",  // Orange 😲
        };

        // Generate color boxes and labels for each sentiment
        Object.entries(sentiments).forEach(([sentiment, color]) => {
          div.innerHTML +=
            `<i style="background:${color}"></i> ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}<br>`;
        });

        return div;
      };

      legend.addTo(map); // Add legend to the map

      // Remove legend when component unmounts
      return () => {
        map.removeControl(legend);
      };
    }, [map]);

    return null; // This component doesn't render anything itself
  };


  const onEachFeature = (feature, layer) => {
    const countryCode = feature.properties.admin;
    const c = countrySentimentsRef.current[countryCode];

    // Add a tooltip with the country name and review count
    layer.bindTooltip(
      `<strong>${feature.properties.admin}</strong><br>Reviews: ${c}`,
      { sticky: true }
    );

    // Log the country name and latest review count when hovered
    layer.on({
      mouseover: () => {

        // Update tooltip dynamically with the latest count
        layer.setTooltipContent(
          `<strong>${feature.properties.admin}</strong><br>Average Sentiment: ${countrySentimentsRef.current[countryCode] || "No data"}
           <br># Reviews: ${countrynumReviewsRef.current[countryCode] || "No data"}`
        );
      },

      click: () => {
        console.log(`Clicked on: ${countryCode}`);

        // Fetch detailed reviews for the clicked country
        fetch(`/api/country-reviews?country=${encodeURIComponent(countryCode)}`)
          .then((response) => response.json())
          .then((reviews) => {
            console.log("Reviews for", countryCode, reviews);

            // Create a popup with scrollable review content
            const popupContent = `
              <div style="max-height: 200px; overflow-y: auto;">
                <h4>${countryCode} Reviews</h4>
                <ul style="padding-left: 10px;">
                  ${reviews.length > 0
                    ? reviews
                        .filter((r) => r.review_text) // Exclude reviews with empty review_text
                        .map((r) => `<li><strong>${r.reviewer_name}:</strong> ${r.review_text || "No text comment provided"}</li>`)
                        .join("")
                    : "<li>No reviews available</li>"}
                </ul>
              </div>
            `;

            // Bind popup to the clicked country
            layer.bindPopup(popupContent).openPopup();
          })
          .catch((error) => {
            console.error("Error fetching reviews:", error);
            const errorPopup = `
              <div>
                <h4>Error fetching reviews</h4>
                <p>There was an error loading the reviews. Please try again later.</p>
              </div>
            `;
            layer.bindPopup(errorPopup).openPopup();
          });
      },
    });
  };

  return (
    <MapContainer
      style={{ height: "500px", width: "100%" }}
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={worldGeoJson} style={style} onEachFeature={onEachFeature} />
      <Legend />
    </MapContainer>
  );
};

export default ChoroplethMap;
