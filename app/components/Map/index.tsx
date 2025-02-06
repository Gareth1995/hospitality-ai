"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import worldGeoJson from "../../data/world.geo.json"; // importing world map
import L from "leaflet"; // Import Leaflet for adding custom controls
import * as d3 from "d3"; // Import d3-scale

const ChoroplethMap = () => {
  // variable to hold <country; count> values
  const [countryCounts, setCountryCounts] = useState({});
  const countryCountsRef = useRef({}); // Store latest countryCounts in a ref

  // Fetch the country counts from the API
  useEffect(() => {
    fetch("/api/country-counts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const counts = data.reduce((acc, item) => {
          acc[item.country] = item.count; // each element in acc is {countryName: 'name', count: count}
          return acc; // return acc each time to continue accumulation
        }, {});
        setCountryCounts(counts); // set array of country - count dictionaries
        countryCountsRef.current = counts; // Update ref
      })
      .catch((error) => console.error("Error fetching country counts:", error));
  }, []);

  // Generate a color scale dynamically based on the countryCounts data
  const getColorScale = () => {
    const counts = Object.values(countryCounts);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    // Ensure the minimum is set to 0 for better visual distinction of small values
    return d3.scaleSequential(d3.interpolateWarm).domain([min, max]);
  };

  const getColor = (count) => {
    const colorScale = getColorScale(); // Get the dynamic color scale
    return colorScale(count || 0); // Use the color scale to assign colors
  };

  // Styling function for each country in the GeoJSON
  const style = (feature) => {
    const countryCode = feature.properties.admin; // calling name property of world map
    const count = countryCounts[countryCode] || 0;

    if (!count) {
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
      const colorScale = getColorScale(); // Get the color scale used for the map

      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const counts = Object.values(countryCounts);
        const min = Math.min(...counts);
        const max = Math.max(...counts);

        // Add a header to the legend
        div.innerHTML += "<h4>Guest Frequency</h4>";

        // Create a gradient of colors based on the data range
        const numberOfColors = 6; // Number of colors in the gradient (adjustable)
        const steps = Array.from({ length: numberOfColors }, (_, i) => min + ((max - min) / (numberOfColors - 1)) * i);

        // Generate color boxes and labels for each step in the scale
        steps.forEach((step) => {
          const color = colorScale(step);
          div.innerHTML +=
            '<i style="background:' +
            color +
            '"></i> ' +
            Math.round(step) + // Display rounded values
            (steps.indexOf(step) !== steps.length - 1 ? "&ndash;" + Math.round(steps[steps.indexOf(step) + 1]) + "<br>" : "+");
        });

        return div;
      };

      legend.addTo(map); // Add the legend to the map

      // Clean up the previous legend when the component unmounts
      return () => {
        map.removeControl(legend);
      };
    }, [map, countryCounts]); // Re-run effect when countryCounts changes

    return null; // This component doesn't render anything itself
  };

  const onEachFeature = (feature, layer) => {
    const countryCode = feature.properties.admin;
    const c = countryCountsRef.current[countryCode];

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
          `<strong>${feature.properties.admin}</strong><br>Reviews: ${countryCountsRef.current[countryCode] || "No data"}`
        );
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
