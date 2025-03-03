'use client';

import { createContext, useContext, useEffect, useState } from "react";

const HotelContext = createContext({});

export const useAuth = () => {
    return useContext(HotelContext);
};

export const HotelIDProvider = ({ children }) => {
  const [hotelId, setHotelId] = useState<string | null>(null);

  useEffect(() => {
    // get hotel ID in local storage
    const storedHotelId = localStorage.getItem("hotelId");
    if (storedHotelId) {
      setHotelId(storedHotelId);
    }
  }, []);

  const updateHotelId = (id) => {
    setHotelId(id);
    console.log('storing hotel ID in local storage');
    localStorage.setItem("hotelId", id); // store hotel_id in local storage
  };
  

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId: updateHotelId }}>
      {children}
    </HotelContext.Provider>
  );
};

// export const useHotelIdTheme = () => useContext(HotelContext);
