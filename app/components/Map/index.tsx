"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import worldGeoJson from "../../data/world.geo.json"; // importing world map
import L from "leaflet"; // Import Leaflet for adding custom controls

const ChoroplethMap = () => {
  // variable to hold <country; count> values
  const [countryCounts, setCountryCounts] = useState({});

  // Fetch the country counts from the API
  useEffect(() => {
    fetch("/api/country-counts")
      .then((response) => response.json())
      .then((data) => {
        const counts = data.reduce((acc, item) => {
          acc[item.country] = item.count; // each element in acc is {countryName: 'name', count: count}
          return acc; // return acc each time to continue accumulation
        }, {});
        setCountryCounts(counts); // set array of country - count dictionaries
      })
      .catch((error) => console.error("Error fetching country counts:", error));
  }, []);

  // Define a color scale based on the counts
  const getColor = (count) => {
    return count > 100
      ? "#800026"
      : count > 50
      ? "#BD0026"
      : count > 20
      ? "#E31A1C"
      : count > 10
      ? "#FC4E2A"
      : count > 5
      ? "#FD8D3C"
      : "#FFEDA0";
  };

  // Styling function for each country in the GeoJSON
  const style = (feature) => {
    const countryCode = feature.properties.adm0_a3; // calling name property of world map
    const count = countryCounts[countryCode] || 0;

    return {
      fillColor: getColor(count),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // Function to create a legend
  const Legend = () => {
    const map = useMap(); // Get the map instance from the useMap hook

    useEffect(() => {
        
        const grades = [0, 5, 10, 20, 50, 100]; // Define the grade intervals
        const legend = L.control({ position: "bottomleft" });

        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "info legend");
            const labels = [];

            // Add a header to the legend
            div.innerHTML += "<h4>Guest Frequency</h4>";

            // Loop through the grade intervals and generate a label with a colored square
            for (let i = 0; i < grades.length; i++) {
            // Adding the color boxes and labels
            const color = getColor(grades[i] + 1);
            div.innerHTML +=
                '<i style="background:' +
                color +
                '"></i> ' +
                grades[i] +
                (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }

            return div;
        };

        legend.addTo(map); // Add the legend to the map

        // Clean up the previous legend when the component unmounts
        return () => {
            map.removeControl(legend);
        };
        }, [map]); // Only run the effect when the map instance is available

        return null; // This component doesn't render anything itself
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
      <GeoJSON data={worldGeoJson} style={style} />
      <Legend />
    </MapContainer>
  );
};

export default ChoroplethMap;
