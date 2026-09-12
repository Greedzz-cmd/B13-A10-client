"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Megaphone, AlertCircle, Check, Sparkles } from "lucide-react";

const INITIAL_APPROVED_TICKETS = [
    {
        _id: "tkt-adv-1",
        title: "Biman Bangladesh Airlines",
        from: "Dhaka",
        to: "Chittagong",
        transportType: "Flight",
        price: 4800,
        isAdvertised: true,
        vendorName: "Biman BD",
    },
    {
        _id: "tkt-adv-2",
        title: "Parabat Express",
        from: "Dhaka",
        to: "Sylhet",
        transportType: "Train",
        price: 850,
        isAdvertised: true,
        vendorName: "Bangladesh Railway",
    },
    {
        _id: "tkt-adv-3",
        title: "Greenline Scania Multi-Axle",
        from: "Dhaka",
        to: "Cox's Bazar",
        transportType: "Bus",
        price: 1800,
        isAdvertised: true,
        vendorName: "Greenline",
    },
    {
        _id: "tkt-adv-4",
        title: "MV Sundarban 10",
        from: "Dhaka",
        to: "Barishal",
        transportType: "Launch",
        price: 450,
        isAdvertised: false,
        vendorName: "Sundarban Shipping",
    },
    {
        _id: "tkt-adv-5",
        title: "Silk City Express",
        from: "Dhaka",
        to: "Rajshahi",
        transportType: "Train",
        price: 480,
        isAdvertised: false,
        vendorName: "Bangladesh Railway",
    },
    {
        _id: "tkt-adv-6",
        title: "US-Bangla ATR 72-600",
        from: "Dhaka",
        to: "Sylhet",
        transportType: "Flight",
        price: 3800,
        isAdvertised: false,
        vendorName: "US-Bangla",
    },
];

export default function AdvertiseTicketsPage() {
    const [tickets, setTickets] = useState(INITIAL_APPROVED_TICKETS);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        fetch(`${apiUrl}/tickets`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    // Filter only approved tickets
                    const approved = data.filter(
                        (t) => (t.verificationStatus || "approved").toLowerCase() === "approved"
                    );
                    if (approved.length > 0) setTickets(approved);
                }
            })
            .catch(() => {});
    }, []);

    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    const handleToggleAdvertise = async (ticketId, currentStatus) => {
        setErrorMessage("");

        if (!currentStatus && advertisedCount >= 6) {
            setErrorMessage("Cannot advertise more than 6 tickets at a time.");
            return;
        }

        const newStatus = !currentStatus;
        const previousTickets = tickets;

        setTickets((prev) =>
            prev.map((t) =>
                (t._id === ticketId || t.id === ticketId)
                    ? { ...t, isAdvertised: newStatus }
                    : t
            )
        );

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            try {
                const res = await fetch(`${apiUrl}/tickets/${ticketId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isAdvertised: newStatus }),
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || "Failed to update advertisement status.");
                }
            } catch (err) {
                setTickets(previousTickets);
                setErrorMessage(err.message || "Failed to update on server.");
            }
        }
    };

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
            <Sidebar role="admin" activeId="advertise-tickets" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header with Slot Indicator */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-serif text-3xl font-medium tracking-tight text-white">
                                Advertise Tickets
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Toggle tickets to feature in the homepage Advertisement Section (max 6).
                            </p>
                        </div>

                        {/* Slot counter badge */}
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#131d31] px-4 py-2 text-xs">
                            <Sparkles className="h-4 w-4 text-[#dd7845]" />
                            <span className="text-slate-400">Slots Used:</span>
                            <span className={`font-mono font-bold ${advertisedCount >= 6 ? "text-amber-400" : "text-emerald-400"}`}>
                                {advertisedCount} / 6
                            </span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Table */}
                    <div className="mt-7 overflow-x-auto rounded-xl border border-white/8 bg-[#131d31]">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">Ticket</th>
                                    <th className="px-4 py-3.5">Operator</th>
                                    <th className="px-4 py-3.5">Transport</th>
                                    <th className="px-4 py-3.5">Price</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {tickets.map((t) => {
                                    const id = t._id || t.id;
                                    const isAdv = Boolean(t.isAdvertised);
                                    return (
                                        <tr key={id} className="transition-colors hover:bg-white/[0.02]">
                                            <td className="px-4 py-3.5 font-medium text-slate-200">
                                                {t.from} → {t.to}
                                                <span className="block text-[11px] font-normal text-slate-400">{t.title}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-300">
                                                {t.vendorName || "Operator"}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-400">
                                                {t.transportType || "Bus"}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono font-medium text-[#dd7845]">
                                                ৳{t.price}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {isAdv ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                                        <Check className="h-3 w-3" /> Advertised
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
                                                        Standard
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleAdvertise(id, isAdv)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                        isAdv
                                                            ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                            : "border border-[#dd7845]/40 bg-[#dd7845]/15 text-[#dd7845] hover:bg-[#dd7845]/25"
                                                    }`}
                                                >
                                                    <Megaphone className="h-3.5 w-3.5" />
                                                    {isAdv ? "Unadvertise" : "Advertise"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
