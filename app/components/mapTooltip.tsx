"use client";

import React from "react";

interface TooltipProps {
  countryName: string;
  numReviews: number;
  xPosition: number;
  yPosition: number;
}

const Tooltip: React.FC<TooltipProps> = ({ countryName, numReviews, xPosition, yPosition }) => {
  if (!countryName) return null; // Don't render if no country is selected

  return (
    <div
      className="absolute bg-white text-gray-800 text-sm shadow-lg rounded-lg px-4 py-2 border border-gray-200"
      style={{
        top: yPosition,
        left: xPosition,
        transform: "translate(-50%, -110%)", // Center above the cursor
        pointerEvents: "none", // Prevents interfering with mouse interactions
        zIndex: 9999,
      }}
    >
      <p className="font-semibold">{countryName}</p>
      <p className="text-gray-600">{numReviews} reviews</p>
    </div>
  );
};

export default Tooltip;
