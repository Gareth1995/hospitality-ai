'use client';

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip
} from "@heroui/react";
import { useAuth } from "../context/authContext";

// column headers for table
export const columns = [
    { name: "NAME", uid: "reviewer_name" },
    { name: "NEGATIVE REVIEW", uid: "negative_review" },
    { name: "SENTIMENT", uid: "sentiment" },
    { name: "RATING", uid: "review_rating" },
    { name: "SOURCE", uid: "source_name" },
    { name: "ACTIONS", uid: "actions" }
];

// delete icon on table
export const DeleteIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 20 20"
            width="1em"
            {...props}
        >
            <path
                d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M8.60834 13.75H11.3833"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.91669 10.4167H12.0834"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
        </svg>
    );
};

export default function AlertTable() {
    const { hotelId } = useAuth();
    const [badReviews, setBadReviews] = useState([]);

    // Send update request to table to change seen to true when delete button sis clicked
    const handleDelete = async (review) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this review?");
        if (!isConfirmed) return;
        
        try {
            const response = await fetch("/api/update-seen", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotelId,
                    reviewer_name: review.reviewer_name,
                    negative_review: review.negative_review,
                    sentiment: review.sentiment
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update review status");
            }
    
            // Remove updated review from state
            setBadReviews(prev => prev.filter(r =>
                !(r.reviewer_name === review.reviewer_name &&
                  r.negative_review === review.negative_review &&
                  r.sentiment === review.sentiment)
            ));
    
        } catch (error) {
            console.error("Error updating review status:", error);
        }
    };

    // effect to fetch bad reviews
    useEffect(() => {
        if (!hotelId) {
            // console.log(`No hotelId for fetching bad reviews`);
            return;
        }

        const fetchBadReviews = async () => {
            try {
                const response = await fetch(`/api/get-bad-reviews?hotelId=${hotelId}`, { next: { revalidate: 21600 } });


                if (!response.ok) {
                    throw new Error('Failed to fetch bad reviews');
                }
                const data = await response.json();
                setBadReviews(data);

            } catch (error) {
                console.error('Error fetching rating by group:', error);
            }
        };
        fetchBadReviews();

    }, [hotelId]);

    // code to render each bad review cell in the table
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Delete">
                            <button onClick={() => handleDelete(user)}>
                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <DeleteIcon />
                                </span>
                            </button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [hotelId]);

    return (
        // returning rechart table
        <Table aria-label="Bad review table">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "sentiment" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={badReviews}>
                {(item) => (
                    <TableRow key={item.reviewer_name}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};