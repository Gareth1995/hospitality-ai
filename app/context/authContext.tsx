'use client';

import { createContext, useContext, useEffect, useState } from "react";

const HotelContext = createContext({});

export const useAuth = () => {
    return useContext(HotelContext);
};

export const HotelIDProvider = ({ children }) => {
  const [hotelId, setHotelId] = useState<string | null>(null);

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId }}>
      {children}
    </HotelContext.Provider>
  );
};

// export const useHotel = () => useContext(HotelContext);
