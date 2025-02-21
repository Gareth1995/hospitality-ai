'use client';

// component that gets the average rating based on user reviews for a specific hotel
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const FeedbackRate = () => {
  const [feedbackRate, setFeedbackRate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { hotelId } = useAuth(); // Get hotelId from context;
  const [loading, setLoading] = useState(true); // 🔹 Track loading state

  useEffect(() => {

    if (!hotelId) {
      console.log('No hotelid for average rating fetch');
      setLoading(false);
      return;
    } // nothing to fetch if hotelId is missing

    const fetchFeedbackRate = async () => {
      
      try {
        setLoading(true);
        const response = await fetch(`/api/get-feedback-rate?hotelId=${hotelId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch feedback rate");
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0 && data[0].feedback_rate) {
        //   setRating(data[0].average_rating); // Format to 2 decimal places
            setFeedbackRate(data[0].feedback_rate);
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

    fetchFeedbackRate();
  }, [hotelId]);

//   return <span>{loading ? <Spinner /> : error ? `Error: ${error}` : feedbackRate}</span>;
    return <span>{feedbackRate}</span>
};

export default FeedbackRate;
