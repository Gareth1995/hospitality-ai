'use client';
import { useState, useEffect } from 'react';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Fetch bookings from the API
  useEffect(() => {
    if (bookings.length === 0) {
        async function fetchBookings() {
            try {
                // Call your API route and cache data for 6 hours
                const response = await fetch('/api/bookings', {next: { revalidate: 21600 }});
                if (!response.ok) {
                  throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                setBookings(data); // Set data to state
            } catch (err) {
                setError(err.message); // Handle errors
            }
        }
        fetchBookings();
    }
  }, []); // Runs once on component mount

  // Render the data
  return (
    <div>
      <h1>Bookings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking, index) => (
            <li key={index}>
              {booking.formatted_date} - {booking.count}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading bookings...</p>
      )}
    </div>
  );
}
