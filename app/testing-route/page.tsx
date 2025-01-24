'use client';

import { useState } from "react";

export default function ScrapeForm() {
  const [hotelName, setHotelName] = useState("");
  const [website, setWebsite] = useState("agoda");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async (hotelName, website) => {
    try {
      console.log("Hotel name:", hotelName);
      console.log("Website: ", website);
      // const res = await fetch(`/api/webscraper?hotelName=${hotelName}&website=${website}`);
      const res = await fetch(`/api/webscraper?hotelName=${encodeURIComponent(hotelName)}&website=${encodeURIComponent(website)}`);

      // const res = await fetch("/api/webscraper");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      } else {
        alert(data.error || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <div>
      <h1>Scrape Hotel Reviews</h1>
      <input
        type="text"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        placeholder="Hotel Name"
      />
      <select value={website} onChange={(e) => setWebsite(e.target.value)}>
        <option value="agoda">Agoda</option>
        <option value="booking">Booking.com</option>
      </select>
      <button onClick={() => fetchReviews(hotelName, website)}>Fetch Reviews</button>

      <h2>Reviews:</h2>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
    </div>
  );
}
