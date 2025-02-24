import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const useFetchHotelData = (endpoint: string, key: string) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { hotelId } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) {
      console.log(`No hotelId for ${endpoint} fetch`);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${endpoint}?hotelId=${hotelId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${key}`);
        
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0 && result[0][key]) {
          setData(result[0][key]);
        } else {
          setError(`No ${key} available`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, endpoint, key]);

  return { data, error, loading };
};

export default useFetchHotelData;