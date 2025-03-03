'use client';

import NavButtons from '../components/navButtons';
import Charts from '../components/charts';
import ThemeToggle from '../components/toggle';
import { useAuth } from "../context/authContext";
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState("");
    const { hotelId, setHotelId } = useAuth();

    // Fetch user name and email from Kinde
    useEffect(() => {
        console.log('fetching user data');
        const fetchUser = async () => {
            try {
                const userRes = await fetch("/api/getKindeUser");
                if (!userRes.ok) throw new Error("Failed to fetch user data");

                const userData = await userRes.json();

                setUserEmail(userData.email);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUser();
    }, []);

    // Fetch hotel_id once username and userEmail are set
    useEffect(() => {
        console.log('fetching hotel id');
        if (!userEmail) return; // Ensure username and email are available before fetching

        const fetchHotelID = async () => {
            const baseUrl = '/api/getUser'; // Ensure leading slash
            const url = new URL(baseUrl, window.location.origin);
            url.searchParams.append('email', userEmail);

            try {
                const backendUserDetails = await fetch(url);
                if (!backendUserDetails.ok) throw new Error("Failed to fetch hotel ID");

                let hotelData = await backendUserDetails.json();
                hotelData = hotelData[0].hotel_id
                console.log("hotel user data:", hotelData);
                setHotelId(hotelData); // Store the hotel_id
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
            <main className="flex-grow relative">
                <div className="flex items-center justify-between p-4">
                    <NavButtons />
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
                <Charts />
            </main>
        </>
    )
}
