"use client";

import { BusFront, Eye, Plane, Ship, TrainFront, UserRound } from "lucide-react";
import { useState } from "react";

const trips = [
    {
        route: "Dhaka → Chittagong",
        details: "Biman Bangladesh Airlines · 2025-01-15 · 08:00",
        reference: "RTL-2BX4N",
        price: "৳9,600",
        status: "Confirmed",
        mode: "flight",
    },
    {
        route: "Dhaka → Sylhet",
        details: "Parabat Express · 2025-01-15 · 06:40",
        reference: "RTL-9P3PQ",
        price: "৳850",
        status: "Confirmed",
        mode: "train",
    },
    {
        route: "Dhaka → Cox's Bazar",
        details: "Shohagh Paribahan · 2025-01-16 · 22:00",
        reference: "RTL-4G6TW",
        price: "৳3,300",
        status: "Pending",
        mode: "bus",
    },
    {
        route: "Dhaka → Khulna",
        details: "MV Sundarban · 2025-01-16 · 18:00",
        reference: "RTL-9K1Y5H",
        price: "৳3,000",
        status: "Cancelled",
        mode: "launch",
    },
];

const stats = [
    ["Total trips", "12", "▣"],
    ["Miles traveled", "4,820", "⌖"],
    ["Total spent", "৳42,300", "▤"],
    ["Member since", "Jan 2024", "♙"],
];

const modeIcons = { flight: Plane, train: TrainFront, bus: BusFront, launch: Ship };

function StatusBadge({ status }) {
    const statusClasses = {
        Confirmed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        Pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
        Cancelled: "border-red-400/20 bg-red-400/10 text-red-300",
    };

    return (
        <span className={`rounded-[3px] border px-1.5 py-0.5 text-[8px] ${statusClasses[status]}`}>
            {status.toLowerCase()}
        </span>
    );
}

function TripRow({ trip }) {
    const Icon = modeIcons[trip.mode];

    return (
        <article className="grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-[7px] border border-white/[0.06] bg-[#172238] px-3 py-3.5 sm:grid-cols-[24px_1fr_100px_78px_20px] sm:gap-4 sm:px-4">
            <span className="text-[#dd7845]">
                <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
                <h2 className="truncate text-[10px] font-medium text-slate-200">{trip.route}</h2>
                <p className="mt-1 truncate text-[8px] text-slate-500">{trip.details}</p>
            </div>
            <div className="hidden text-right sm:block">
                <p className="font-mono text-[8px] text-slate-500">{trip.reference}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-slate-200">{trip.price}</p>
                <StatusBadge status={trip.status} />
            </div>
            <button
                aria-label={`View ${trip.route} booking`}
                className="text-slate-500 transition-colors hover:text-[#dd7845]"
                type="button"
            >
                <Eye aria-hidden="true" className="h-3 w-3" strokeWidth={1.5} />
            </button>
        </article>
    );
}

export default function MyTripsPage() {
    const [activeTab, setActiveTab] = useState("Bookings");

    return (
        <main className="min-h-[calc(100vh-60px)] bg-[#080f1d] text-slate-100">
            <div className="mx-auto max-w-[960px] px-5 py-7 sm:px-8 sm:py-9">
                <header className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dd7845]/20 bg-[#2a2630] text-[#dd7845]">
                            <UserRound aria-hidden="true" className="h-4 w-4" strokeWidth={1.4} />
                        </span>
                        <div>
                            <h1 className="font-serif text-[16px] text-slate-200">Nusrat Jahan</h1>
                            <p className="mt-0.5 font-mono text-[8px] text-slate-500">nusrat@example.com · Traveler</p>
                        </div>
                    </div>
                    <button
                        className="mt-2 text-[9px] text-slate-500 transition-colors hover:text-[#dd7845]"
                        type="button"
                    >
                        ↪ Sign out
                    </button>
                </header>

                <section className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5" aria-label="Travel summary">
                    {stats.map(([label, value, icon]) => (
                        <div key={label} className="rounded-[7px] border border-white/[0.06] bg-[#172238] px-3 py-2.5">
                            <div className="flex items-center justify-between text-[7px] uppercase tracking-[0.13em] text-slate-500">
                                <span>{label}</span>
                                <span className="text-[#dd7845]">{icon}</span>
                            </div>
                            <p className="mt-2 font-serif text-[14px] text-slate-200">{value}</p>
                        </div>
                    ))}
                </section>

                <div className="mt-5 inline-flex rounded-[5px] border border-white/[0.06] bg-[#111b2e] p-0.5">
                    {["Bookings", "Profile"].map(tab => (
                        <button
                            key={tab}
                            className={`rounded-[3px] px-3 py-1.5 text-[9px] transition-colors ${activeTab === tab ? "bg-[#172238] text-slate-200" : "text-slate-500 hover:text-slate-300"}`}
                            onClick={() => setActiveTab(tab)}
                            type="button"
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Bookings" ? (
                    <section className="mt-3 space-y-2" aria-label="Your bookings">
                        {trips.map(trip => (
                            <TripRow key={trip.reference} trip={trip} />
                        ))}
                    </section>
                ) : (
                    <section className="mt-3 rounded-[7px] border border-white/[0.06] bg-[#172238] p-5 text-[10px] text-slate-400">
                        Profile details for Nusrat Jahan are ready to edit.
                    </section>
                )}
            </div>
        </main>
    );
}
