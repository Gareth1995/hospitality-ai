"use client"; // Ensure it runs in the browser

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import worldGeoJson from '../data/africa.geo.json'; // Replace with your GeoJSON file

export default function WorldChoropleth() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up SVG and container dimensions
    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);

    // Function to draw the map
    const drawMap = () => {
      const { width, height } = container.node().getBoundingClientRect();
      svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");

      // Set up projection and path generator
      const projection = d3.geoMercator()
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 1.5]);

      const path = d3.geoPath().projection(projection);

      // Draw the world map
      svg.selectAll("path")
        .data(worldGeoJson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .attr("stroke", "#333")
        .on("click", function (event, d) {
          if (d.properties.ADMIN === "South Africa") {
            console.log("This must zoom into SA");
          }
        });
    };

    // Initial draw
    drawMap();

    // Redraw on window resize
    window.addEventListener("resize", drawMap);

    return () => window.removeEventListener("resize", drawMap);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-blend-color-burn">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}
