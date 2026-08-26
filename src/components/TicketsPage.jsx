"use client";

import { useState } from "react";

// Available transport mode filters.
const transportTypes = ["All", "Flight", "Train", "Bus", "Launch"];
// Available fare class filters.
const fareClasses = ["All", "Economy", "Business", "First"];

export default function TicketsPage() {
    // Ticket browsing page with independent mode and fare filters.
    const [transport, setTransport] = useState("All");
    const [fare, setFare] = useState("All");
    return (
        <main className="min-h-svh bg-[#080f1d] text-slate-100">
            <div className="mx-auto max-w-350 px-5 py-8">
                {/* Page heading and route browsing context. */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <p className="m-0 text-[9px] uppercase tracking-[0.15em] text-[#dd7845]">All tickets</p>
                        <h1 className="mt-2 font-serif text-[32px] font-semibold text-slate-100">Browse routes</h1>
                    </div>
                    <span className="text-[11px] text-gray-400">Explore available routes</span>
                </div>

                {/* Search, transport, fare, and sorting controls. */}
                <div className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border border-[#1e3a5f] bg-[#0f172a] p-2 max-md:flex-col max-md:items-stretch">
                    <label className="flex min-w-45 flex-1 items-center gap-2 rounded-md border border-[#253149] bg-[#151f32] px-3 py-2 text-[11px] text-gray-400">
                        <span aria-hidden="true">⌕</span>
                        <input
                            className="min-w-0 flex-1 bg-transparent text-[11px] text-gray-200 outline-none placeholder:text-gray-500"
                            name="search"
                            placeholder="Search cities..."
                        />
                    </label>
                    {/* Independent transport mode selection. */}
                    <fieldset className="min-w-0 flex-none rounded-md border border-[#253149] bg-[#151f32] p-1 max-md:w-full">
                        <div className="flex justify-center gap-1.5 overflow-x-auto max-md:w-full">
                            {transportTypes.map(type => (
                                <button
                                    className={`whitespace-nowrap rounded px-3 py-1.5 text-[10px] transition ${transport === type ? "bg-[#dd7845] text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                                    key={type}
                                    onClick={() => setTransport(type)}
                                    type="button"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                    {/* Independent fare class selection. */}
                    <fieldset className="min-w-0 flex-none rounded-md border border-[#253149] bg-[#151f32] p-1 max-md:w-full">
                        <div className="flex justify-center gap-1.5 overflow-x-auto max-md:w-full">
                            {fareClasses
                                .filter(type => transport !== "Bus" || type !== "First")
                                .map(type => (
                                    <button
                                        className={`whitespace-nowrap rounded px-3 py-1.5 text-[10px] transition ${fare === type ? "bg-[#dd7845] text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                                        key={type}
                                        onClick={() => setFare(type)}
                                        type="button"
                                    >
                                        {type}
                                    </button>
                                ))}
                        </div>
                    </fieldset>
                    <label className="flex items-center gap-1.5 rounded-md border border-[#253149] bg-[#151f32] px-3 py-2 text-[10px] text-gray-400">
                        <span>↓</span>
                        <select
                            className="bg-transparent text-[10px] text-gray-200 outline-none"
                            defaultValue="price"
                            aria-label="Sort tickets"
                        >
                            <option value="price">Price</option>
                            <option value="date">Departure</option>
                        </select>
                    </label>
                </div>
            </div>
        </main>
    );
}
