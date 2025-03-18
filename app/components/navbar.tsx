import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const [hotelNames, setHotelNames] = useState([]);
  const { hotelId, setHotelId, setHotelName } = useAuth();

  // call fetch to query postgres database for all unique hotel names
  useEffect(() => {
    const fetchHotelNames = async () => {

      try{
        const getHotelNames = await fetch(`/api/getHotels`, {next: { revalidate: 21600 }});

        // check if api returns correct data
        if (!getHotelNames){
          throw new Error('Failed to fetch hotel names');
        }
        const hn = await getHotelNames.json() 
        setHotelNames(hn);

        // Initialize hotelId and hotelName with the first hotel in the list
        if (hn.length > 0) {
          setHotelId(hn[0].hotel_id);
          setHotelName(hn[0].hotel_name);
        }

      } catch(error){
        console.error('Error fetching hotel names:', error);
      }
      
    }
    fetchHotelNames();
  }, [])

  const handleHotelChange = (event) => {
    setHotelId(event.target.value);
    setHotelName(event.target.selectedOptions[0].text);
  }
    

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-2">
        <select
          className="w-[300px] bg-[var(--navbar-bg-col)] text-[var(--navbar-text-col)] px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          value={hotelId || ""} // Ensure the dropdown reflects the current hotelId
          onChange={handleHotelChange} // Update context on selection change
        >
          <option value="">-- Select a Hotel --</option>
          {hotelNames.map((hotel, index) => (
            <option key={index} value={hotel.hotel_id}>{hotel.hotel_name}</option>
          ))}
        </select>
        <div className="flex items-center"></div>
      </nav>
    </>
  );
};

export default Navbar;
