'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import {Spinner} from "@heroui/react";

const ModalSentiment = () => {
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { hotelId } = useAuth(); // Get hotelId from context;
  const [loading, setLoading] = useState(true); // 🔹 Track loading state

  useEffect(() => {

    if (!hotelId) {
      console.log('No hotelid for modal sentiment fetch');
      setLoading(false);
      return;
    } // nothing to fetch if hotelId is missing

    const fetchRating = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/modal-sentiment?hotelId=${hotelId}`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [hotelId]);

  return <span>{loading ? <Spinner /> : error ? `Error: ${error}` : `${sentiment}`}</span>;
};

export default ModalSentiment;
