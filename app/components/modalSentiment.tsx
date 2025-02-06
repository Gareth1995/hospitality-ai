'use client';

import { useEffect, useState } from "react";

const ModalSentiment = () => {
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch("/api/modal-sentiment");
        if (!response.ok) {
          throw new Error("Failed to fetch rating");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].sentiment) {
        //   setRating(data[0].average_rating); // Format to 2 decimal places
            setSentiment(data[0].sentiment);
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

  return <span>{error ? `Error: ${error}` : `${sentiment}`}</span>;
};

export default ModalSentiment;
