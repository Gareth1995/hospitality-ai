'use client';

import Charts from './components/charts';
import ThemeToggle from './components/toggle';
import { useAuth } from "./context/authContext";
import { useEffect, useState } from 'react';
import Navbar from "./components/navbar";

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState("");
    const { hotelId, setHotelId } = useAuth();

    // Fetch hotel_id once username and userEmail are set
    useEffect(() => {
        console.log('fetching hotel id');
        // if (!userEmail) return; // Ensure username and email are available before fetching

        const fetchHotelID = async () => {

            try {
                setHotelId('MORBAY1');
            } catch (err) {
                console.error("Error fetching hotel ID:", err);
            }
        };

        fetchHotelID();
    }, [userEmail]); // Runs only when username and userEmail are available

    // console log hotel ID context variable
    useEffect(() => {
        console.log(hotelId);
    }, [hotelId])
    
    return (
        <>
            {/* <h1>Reviewer Analytics for {hotelId}</h1> */}

            <header className="flex flex-col items-center justify-center py-4">
                <h1 className="text-2xl font-semibold text-center">Reviewer Analytics for {hotelId}</h1>
            </header>

            <main className="flex-grow relative">
                <div className="flex items-center justify-between p-4">
                    {/* <NavButtons /> */}
                    <Navbar/>
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
                <Charts />
            </main>
        </>
    )
}


