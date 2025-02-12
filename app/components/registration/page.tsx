'use client';

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Autocomplete, AutocompleteItem } from "@heroui/react";

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [hotels, setHotels] = useState<{ label: string; key: string; description: string; }[]>([]);

    useEffect(() => {
        // pull all unique hotel names from hotel table and assign the array to hotels
        setHotels([
            {label: "Kwantu", key: "kwantu", description: "Cape Town hotel based in Milnerton"},
            {label: "Bantry Bay Hotel", key: "bantrybayhotel", description: "The bantry bay hotel"},
            {label: "The Capetonian", key: "capetonian", description: "the capetonian"},
        ]);
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const result = await callServer(data);

        setErrors(result.errors);
        setIsLoading(false);
    };

    return (
        <Form
            className="w-full max-w-xs"
            validationBehavior="native"
            validationErrors={errors}
            onSubmit={onSubmit}
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

            <Autocomplete className="max-w-xs" label="Select your hotel" labelPlacement="outside">
                {hotels.map((hotel) => (
                    <AutocompleteItem key={hotel.key}>{hotel.label}</AutocompleteItem>
                ))}
            </Autocomplete>
            <Button color="primary" isLoading={isLoading} type="submit">
                Submit
            </Button>
        </Form>
    );
}

// Fake server used in this example.
async function callServer(_) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        errors: {
            username: "Sorry, this username is taken.",
        },
    };
}