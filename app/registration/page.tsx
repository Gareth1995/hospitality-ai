'use client';

import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { useAuth } from "../context/authContext";

export default function App() {
    const { hotelId, setHotelId } = useAuth();
    const [hotelNames, setHotelNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetching hotel names when the component mounts
    useEffect(() => {
        const fetchHotelNames = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await fetch('api/getHotels');
                if (!response.ok) {
                    throw new Error("Failed to fetch hotel names");
                }
                const data = await response.json();
                setHotelNames(data);
            } catch (err) {
                setError("An error occurred while fetching hotels.");
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchHotelNames();
    }, []);

    // Handles hotel selection and updating the hotel_id
    const onPress = async () => {
        if (!selectedHotel) {
            setError("Please select a hotel.");
            return;
        }

        try {
            // Fetch the hotel ID based on the selected hotel name
            const hotelResponse = await fetch(`/api/getHotelId?name=${encodeURIComponent(selectedHotel)}`);
            if (!hotelResponse.ok) {
                throw new Error("Failed to fetch hotel ID");
            }
            const { hotel_id } = await hotelResponse.json();
            setHotelId(hotel_id); // Update hotel ID in the context (test on dashboard useEffect)
            console.log("Hotel ID: ", hotel_id);

            // Fetch Kinde user data
            const userRes = await fetch("/api/getKindeUser");
            if (!userRes.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await userRes.json();
            console.log(userData.given_name, userData.email);

            // query your database and store a user with name, email and hotel_id (fetch function) 

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {error && <p className="text-red-500">{error}</p>} {/* Display error messages */}

            <Autocomplete
                className="max-w-xs"
                label="Please Select Your Establishment"
                onSelectionChange={(key) => {
                    setSelectedHotel(key);
                }}
            >
                {hotelNames.map((h) => (
                    <AutocompleteItem key={h.name}>{h.name}</AutocompleteItem>
                ))}
            </Autocomplete>

            <Button color="primary" onPress={onPress} disabled={isLoading}>
                {isLoading ? "Loading..." : "Continue"}
            </Button>
        </div>
    );
}
