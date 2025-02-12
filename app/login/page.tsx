'use client';

import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "@heroui/react";
import { useAuth } from "../context/authContext";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [userEmail, setUserEmail] = useState(null);
    const [loginHint, setLoginHint] = useState("");
    const { setHotelId } = useAuth();

    // When userEmail updates, also update loginHint
    useEffect(() => {
        if (userEmail) {
            console.log("Updated email:", userEmail);
            setLoginHint(userEmail);
        }
    }, [userEmail]);

    // Handle the login process
    const onPress = async (e) => {

        // e.preventDefault(); // Prevent default form submission
        console.log('Sign in clicked');

        const formData = new FormData(e.target.form);
        const username = formData.get('name');
        const email = formData.get('email');

        console.log("email:", loginHint);

        if (!username || !email) {
            setErrors({ message: 'Both username and email are required' });
            return;
        }

        try {
            setIsLoading(true);

            // Fetch user from the database based on username and email
            const res = await fetch(`/api/getUser?username=${username}&email=${email}`);
            if (!res.ok) {
                throw new Error('User not found or failed to fetch');
            }

            const data = await res.json();

            if (data.length === 0) {
                setErrors({ message: 'No user found' });
                return;
            }

            // Get the hotel_id from the fetched user data
            const hotelId = data[0].hotel_id;
            if (!hotelId) {
                setErrors({ message: 'User does not belong to any hotel' });
                return;
            }

            // Set hotel_id in authentication context
            setHotelId(hotelId);
            console.log('User signed in and hotel_id set:', hotelId);

        } catch (error) {
            console.error('Error during sign in:', error.message);
            setErrors({ message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form
            className="w-full max-w-xs"
            validationBehavior="native"
            validationErrors={errors}
        >
            <Input
                isRequired
                isDisabled={isLoading}
                label="Name"
                labelPlacement="outside"
                name="name"
                placeholder="Enter your name"
            />

            <Input
                isRequired
                isDisabled={isLoading}
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
            />

            <LoginLink authUrlParams={{
                connection_id: process.env.KINDE_EMAIL_CONNECTION_ID,
                login_hint: loginHint
            }}>

                <Button
                    color="primary"
                    isLoading={isLoading}
                    type="button"
                    // onPress={onPress}
                    >
                        Log In
                </Button>

            </LoginLink>
            
        </Form>
    );
}

