"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    PlaneTakeoff,
    TramFront,
    BusFront,
    Ship,
    Search,
    ArrowLeftRight,
    Calendar,
    ChevronDown,
} from "lucide-react";

const LOCATIONS = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Cox's Bazar",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
];

const MODES = [
    { id: "flight", label: "Flight", icon: PlaneTakeoff, transportType: "Flight" },
    { id: "train", label: "Train", icon: TramFront, transportType: "Train" },
    { id: "bus", label: "Bus", icon: BusFront, transportType: "Bus" },
    { id: "launch", label: "Launch", icon: Ship, transportType: "Launch" },
];

export default function RouteSearchWidget() {
    const router = useRouter();
    const [transport, setTransport] = useState("bus");
    const [from, setFrom] = useState("Dhaka");
    const [to, setTo] = useState("Chittagong");
    const [date, setDate] = useState("");
    const [seats, setSeats] = useState("1");

    const handleSwap = () => {
        setFrom(to);
        setTo(from);
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        const selectedMode = MODES.find((m) => m.id === transport);
        const transportParam = selectedMode ? selectedMode.transportType : "All";

        const params = new URLSearchParams();
        if (transportParam && transportParam !== "All") {
            params.set("transport", transportParam);
        }
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (date) params.set("date", date);
        if (seats) params.set("seats", seats);

        // General search query combining route for the tickets filter
        params.set("q", `${from} ${to}`);

        router.push(`/tickets?${params.toString()}`);
    };

    return (
        <div
            id="routes"
            className="relative mx-auto mt-20 max-w-[920px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1324]/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:mt-24"
        >
            {/* Transport mode selector tabs */}
            <div className="flex border-b border-white/10 bg-black/25 px-2 sm:px-4" role="tablist">
                {MODES.map((mode) => {
                    const IconComponent = mode.icon;
                    const isActive = transport === mode.id;

                    return (
                        <button
                            key={mode.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setTransport(mode.id)}
                            className={`group relative flex flex-1 items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-[13px] font-medium transition-all ${
                                isActive
                                    ? "text-[#dd7845] font-semibold bg-white/[0.02]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                            }`}
                        >
                            <IconComponent
                                className={`h-4 w-4 transition-transform group-hover:scale-105 ${
                                    isActive ? "text-[#dd7845]" : "text-slate-400 group-hover:text-slate-200"
                                }`}
                                strokeWidth={1.8}
                            />
                            <span>{mode.label}</span>

                            {/* Active Tab Accent Line */}
                            {isActive && (
                                <span className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-[#dd7845] shadow-[0_0_10px_#dd7845]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search form controls */}
            <form onSubmit={handleSearch} className="p-4 sm:p-5">
                <div className="grid items-end gap-3 sm:grid-cols-[1.3fr_auto_1.3fr_1.1fr_95px_auto]">
                    {/* Departure Location (From) */}
                    <div className="relative">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                            From
                        </label>
                        <div className="relative">
                            <select
                                aria-label="Departure city"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#080f1d] px-3.5 pr-8 text-xs sm:text-sm font-medium text-slate-100 transition-all hover:bg-[#0c1628] focus:border-[#dd7845] focus:outline-none focus:ring-1 focus:ring-[#dd7845]/50 cursor-pointer"
                            >
                                {LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc} className="bg-[#080f1d] text-slate-100">
                                        {loc}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Swap Departure & Destination Button */}
                    <div className="flex items-center justify-center pb-0.5">
                        <button
                            type="button"
                            onClick={handleSwap}
                            aria-label="Swap departure and destination"
                            title="Swap departure and destination"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#080f1d] text-slate-400 transition-all hover:border-[#dd7845] hover:bg-[#0c1628] hover:text-[#dd7845] active:scale-90"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Destination Location (To) */}
                    <div className="relative">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                            To
                        </label>
                        <div className="relative">
                            <select
                                aria-label="Destination city"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#080f1d] px-3.5 pr-8 text-xs sm:text-sm font-medium text-slate-100 transition-all hover:bg-[#0c1628] focus:border-[#dd7845] focus:outline-none focus:ring-1 focus:ring-[#dd7845]/50 cursor-pointer"
                            >
                                {LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc} className="bg-[#080f1d] text-slate-100">
                                        {loc}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="relative">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                aria-label="Travel date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#080f1d] px-3.5 text-xs sm:text-sm font-medium text-slate-100 transition-all hover:bg-[#0c1628] focus:border-[#dd7845] focus:outline-none focus:ring-1 focus:ring-[#dd7845]/50 [color-scheme:dark] cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Seats Selector */}
                    <div className="relative">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                            Seats
                        </label>
                        <div className="relative">
                            <select
                                aria-label="Number of seats"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#080f1d] px-3.5 pr-7 text-xs sm:text-sm font-medium text-slate-100 transition-all hover:bg-[#0c1628] focus:border-[#dd7845] focus:outline-none focus:ring-1 focus:ring-[#dd7845]/50 cursor-pointer"
                            >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={num} className="bg-[#080f1d] text-slate-100">
                                        {num}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#dd7845] px-6 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#dd7845]/25 transition-all hover:bg-[#ee8954] hover:shadow-[#dd7845]/35 active:scale-95 cursor-pointer"
                    >
                        <Search className="h-4 w-4" strokeWidth={2.2} />
                        <span>Search</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
