'use client';
import { ResponsiveCalendar } from '@nivo/calendar';
import { useState, useEffect } from 'react';
import React from 'react';

// function to pull data from database
const fetchData = async () => {
    try {
        // Call bookings API route and cache data for 6 hours
        const response = await fetch('/api/bookings', {next: { revalidate: 21600 }});
        // console.log(response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON response
        return data;
    } catch (err) {
        console.log(err.message); // Handle errors
        return [];
    }
};

// function to wrangle data for calendar chart
const wrangleData = (data) => {
    // check if data coming in is in correct format
    if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        return [];
    }

    // create array of <day, value> arrays for calendar map
    return data.map((item) => ({
        day: item.formatted_date,
        value: item.count,
    }));
};

const NivoCalendarChart = () => {
    const [chartData, setChartData] = useState([]); // variable to hold data from server

    // Default sample data
    // const dummyData = [
    //     { day: '2024-12-25', value: 30 },
    //     { day: '2024-01-01', value: 20 },
    //     { day: '2024-02-14', value: 50 },
    // ];

    // pull data and save it locally on component mount
    useEffect(() => {
        const getData = async () => {
            const rawBookings = await fetchData();
            // check if there is any data that was fetched, if not do nothing
            if (rawBookings && rawBookings.length > 0) {
                const cleanedBookings = wrangleData(rawBookings);
                // console.log(cleanedBookings);
                setChartData(cleanedBookings);
            }
        };

        getData();
    }, []);

    // Theme object for Nivo Calendar
    const theme = {
        "text":{
            "fontSize": 11,
            "fill": "var(--card-text-col)", // Changes axis text colour based on light or dark mode
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
    };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveCalendar
        data={chartData}
        from="2016-01-01"
        to="2016-12-31"
        emptyColor="#eeeeee"
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        theme={theme}
        tooltip={({ day, value }) => (
          <div
            style={{
              padding: '5px',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <strong>{day}</strong>: {value || 0}
          </div>
        )}
      />
    </div>
  );
};

export default NivoCalendarChart;