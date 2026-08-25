"use client";

import { useState } from "react";

const transportTypes = ["All", "Flight", "Train", "Bus", "Launch"];
const fareClasses = ["All", "Economy", "Business", "First"];

export default function TicketsPage() {
    const [transport, setTransport] = useState("All");
    const [fare, setFare] = useState("All");
    return (
        <main className="min-h-svh bg-[#080f1d] text-slate-100">
            <div className="mx-auto max-w-[1400px] px-5 py-8">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <p className="m-0 text-[9px] uppercase tracking-[0.15em] text-[#dd7845]">All tickets</p>
                        <h1 className="mt-2 font-serif text-[32px] font-semibold text-slate-100">Browse routes</h1>
                    </div>
                    <span className="text-[11px] text-gray-400">Explore available routes</span>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg border border-[#1e3a5f] bg-[#0f172a] p-5 max-md:flex-col max-md:items-stretch">
                    <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded border border-[#253149] bg-[#1a2332] px-3 py-2 text-[11px] text-gray-400">
                        <span aria-hidden="true">⌕</span>
                        <input
                            className="min-w-0 flex-1 bg-transparent text-[11px] text-gray-200 outline-none placeholder:text-gray-500"
                            name="search"
                            placeholder="Search cities..."
                        />
                    </label>
                    <div className="flex gap-1.5 overflow-x-auto max-md:w-full" aria-label="Transport type">
                        {transportTypes.map(type => (
                            <button
                                className={`whitespace-nowrap rounded border px-3 py-1.5 text-[10px] transition ${transport === type ? "border-[#dd7845] bg-[#dd7845] text-white" : "border-gray-700 bg-[#1a2332] text-gray-400 hover:border-[#dd7845] hover:text-[#dd7845]"}`}
                                key={type}
                                onClick={() => setTransport(type)}
                                type="button"
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto max-md:w-full" aria-label="Fare class">
                        {fareClasses.map(type => (
                            <button
                                className={`whitespace-nowrap rounded border px-3 py-1.5 text-[10px] transition ${fare === type ? "border-[#dd7845] bg-[#dd7845] text-white" : "border-gray-700 bg-[#1a2332] text-gray-400 hover:border-[#dd7845] hover:text-[#dd7845]"}`}
                                key={type}
                                onClick={() => setFare(type)}
                                type="button"
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <label className="flex items-center gap-1.5 rounded border border-[#253149] bg-[#1a2332] px-3 py-1.5 text-[10px] text-gray-400">
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
