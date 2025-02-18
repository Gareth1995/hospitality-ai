'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const AvgRating = () => {
  const [rating, setRating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { hotelId } = useAuth(); // Get hotelId from context

  useEffect(() => {

    if (!hotelId) {
      console.log('No hotelid for average rating fetch');
      return;
    } // nothing to fetch if hotelId is missing

    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/avg-rating?hotelId=${hotelId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch rating");
        }
        const data = await response.json();
        
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
  }, [hotelId]);

  return <span>{error ? `Error: ${error}` : `${rating}`}</span>;
};

export default AvgRating;
