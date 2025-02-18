'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import {
    Autocomplete,
    AutocompleteItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function App() {
    const [hotelNames, setHotelNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal state management
    const router = useRouter(); // Initialize the router

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

            // Store the user in your database
            const storeUserResponse = await fetch("/api/saveUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userData.given_name, // Use the user's name from Kinde
                    email: userData.email, // Use the user's email from Kinde
                    hotel_id: hotel_id, // Use the fetched hotel ID
                }),
            });

            if (!storeUserResponse.ok) {
                const errorData = await storeUserResponse.json();
                if (storeUserResponse.status === 409) {
                    onOpen(); // Open the modal if the user already exists
                    return;
                } else {
                    throw new Error("Failed to store user in the database");
                }
            }

            const newUser = await storeUserResponse.json();
            console.log("User stored successfully:", newUser);

            // Redirect to the dashboard after successful user creation
            router.push("/dashboard");

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

            {/* Popup Modal if user already exists */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">User Already Exists</ModalHeader>
                            <ModalBody>
                                <p>
                                    This user already exists. Please either log in with your user details or return to registration.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                <RegisterLink postLoginRedirectURL="/registration">Sign Up</RegisterLink>
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                <LoginLink>Sign In</LoginLink>
                            </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}