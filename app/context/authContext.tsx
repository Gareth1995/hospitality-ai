"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HotelContextType {
  hotelId: string | null;
  setHotelId: (id: string | null) => void;
  hotelName: string | null;
  setHotelName: (name: string | null) => void;
}

// Provide default values to avoid errors
const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const useAuth = (): HotelContextType => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useAuth must be used within a HotelIDProvider");
  }
  return context;
};

interface HotelIDProviderProps {
  children: ReactNode;
}

export const HotelIDProvider: React.FC<HotelIDProviderProps> = ({ children }) => {
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string | null>(null);

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId, hotelName, setHotelName }}>
      {children}
    </HotelContext.Provider>
  );
};
