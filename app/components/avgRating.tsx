'use client';

import { useEffect, useState } from "react";

const AvgRating = () => {
  const [rating, setRating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch("/api/avg-rating");
        if (!response.ok) {
          throw new Error("Failed to fetch rating");
        }
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data) && data.length > 0 && data[0].average_rating) {
        //   setRating(data[0].average_rating); // Format to 2 decimal places
            setRating(parseFloat(data[0].average_rating).toFixed(2));
        } else {
          setError("No rating available");
        }
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message); // Now TypeScript knows 'err' is an Error
          } else {
            setError("An unexpected error occurred"); // Fallback for unknown errors
          }
      }
    };

    fetchRating();
  }, []);

  return <span>{error ? `Error: ${error}` : `${rating}`}</span>;
};

export default AvgRating;
