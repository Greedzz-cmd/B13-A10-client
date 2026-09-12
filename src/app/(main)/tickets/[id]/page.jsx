import React from "react";
import TicketDetailsClient from "@/components/TicketDetailsClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `Ticket Details #${id} | Routely`,
    };
}

const fallbackTickets = [
    {
        _id: "cox-bazar-train",
        title: "Cox's Bazar Express",
        from: "Dhaka",
        to: "Cox's Bazar",
        price: 750,
        quantity: 120,
        totalSeats: 120,
        departureDateTime: "2026-10-08T10:00:00",
        arrivalDateTime: "2026-10-08T20:30:00",
        duration: "10h 30m",
        transportType: "Train",
        fareClass: "Economy",
        verificationStatus: "approved",
        perks: ["AC Coach", "Charging Ports", "Pantry Car", "WiFi"],
        vendorName: "Bangladesh Railway",
        vendorEmail: "railway@example.com",
        image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "regent-airways",
        title: "Regent Airways",
        from: "Sylhet",
        to: "Dhaka",
        price: 3100,
        quantity: 72,
        totalSeats: 72,
        departureDateTime: "2026-10-22T13:15:00",
        arrivalDateTime: "2026-10-22T14:10:00",
        duration: "0h 55m",
        transportType: "Flight",
        fareClass: "Business",
        verificationStatus: "approved",
        perks: ["Snack", "Carry-on", "Fast Boarding", "Lounge Access"],
        vendorName: "Regent Airways",
        vendorEmail: "regent@example.com",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "speedboat-express",
        title: "Speedboat Express",
        from: "Dhaka",
        to: "Chandpur",
        price: 420,
        quantity: 20,
        totalSeats: 40,
        departureDateTime: "2026-11-05T07:00:00",
        arrivalDateTime: "2026-11-05T10:30:00",
        duration: "3h 30m",
        transportType: "Launch",
        fareClass: "Economy",
        verificationStatus: "approved",
        perks: ["Deck View", "Snack", "Life Jacket"],
        vendorName: "Meghna Waterways",
        vendorEmail: "waterways@example.com",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "hanif-enterprise",
        title: "Hanif Enterprise",
        from: "Dhaka",
        to: "Sylhet",
        price: 880,
        quantity: 28,
        totalSeats: 40,
        departureDateTime: "2026-11-16T21:30:00",
        arrivalDateTime: "2026-11-17T06:20:00",
        duration: "8h 20m",
        transportType: "Bus",
        fareClass: "Economy",
        verificationStatus: "approved",
        perks: ["AC", "WiFi", "USB Charging", "Blanket"],
        vendorName: "Hanif Paribahan",
        vendorEmail: "hanif@example.com",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    },
];

async function getTicketById(id) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
        try {
            const res = await fetch(`${apiUrl}/tickets/${id}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                if (data && (data._id || data.id)) {
                    return data;
                }
            }
        } catch (err) {
            console.error("Failed to load ticket from API:", err);
        }
    }

    // Fallback to preconfigured list
    const found = fallbackTickets.find(
        (t) => t._id === id || t.id === id || String(t._id).toLowerCase() === String(id).toLowerCase()
    );
    if (found) return found;

    // Generic fallback for any other ID
    return {
        _id: id,
        title: "Greenline Scania Multi-Axle",
        from: "Dhaka",
        to: "Chittagong",
        price: 1200,
        quantity: 32,
        totalSeats: 40,
        departureDateTime: "2026-12-01T22:30:00",
        arrivalDateTime: "2026-12-02T05:30:00",
        duration: "7h 00m",
        transportType: "Bus",
        fareClass: "Business",
        verificationStatus: "approved",
        perks: ["AC", "WiFi", "Mineral Water", "USB Charging", "Snacks"],
        vendorName: "Greenline Express",
        vendorEmail: "vendor@greenline.com",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    };
}

export default async function TicketDetailsPage({ params }) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    return <TicketDetailsClient ticket={ticket} />;
}
