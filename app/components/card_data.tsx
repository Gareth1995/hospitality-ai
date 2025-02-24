'use client';

import useFetchHotelData from "../hooks/useFetchCardData";
import { Spinner } from "@heroui/react";

interface CardDetailsProps {
  api_endpoint: string;
  datakey: string;
}

const CardDetails: React.FC<CardDetailsProps> = ({ api_endpoint, datakey }) => {
  
  const { data: cardData, error, loading } = useFetchHotelData(api_endpoint, datakey);

  return <span>{loading ? <Spinner /> : error ? `Error: ${error}` : cardData}</span>;
};

export default CardDetails;
