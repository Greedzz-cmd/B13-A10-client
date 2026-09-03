"use client";

import { ChevronDown, Filter, LayoutGrid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";
import TicketCard, { getFareClass } from "./TicketCard";

// Available transport mode filters.
const transportTypes = ["All", "Flight", "Train", "Bus", "Launch"];
// Available fare class filters.
const fareClasses = ["All", "Economy", "Business", "First"];

// Helper to resolve valid transport type from URL param or default to "All"
const resolveInitialTransport = (paramTransport) => {
    if (!paramTransport) return "All";
    const matched = transportTypes.find(
        type => type.toLowerCase() === paramTransport.toLowerCase(),
    );
    return matched || "All";
};

export default function TicketsPage({ tickets, initialTransport = "" }) {
    // Ticket browsing page with independent mode, fare filters, search, and sorting.
    const [transport, setTransport] = useState(() => resolveInitialTransport(initialTransport));
    const [fare, setFare] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("price");
    const [viewMode, setViewMode] = useState("grid");

    // Filter and sort the ticket cards according to user selections.
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            // Mode filter
            if (transport !== "All" && ticket.transportType !== transport) {
                return false;
            }
            // Fare class filter
            if (fare !== "All" && getFareClass(ticket) !== fare) {
                return false;
            }
            // Search text filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchesFrom = ticket.from.toLowerCase().includes(query);
                const matchesTo = ticket.to.toLowerCase().includes(query);
                const matchesVendor = ticket.vendorName.toLowerCase().includes(query);
                const matchesMode = ticket.transportType.toLowerCase().includes(query);
                const matchesFromCode = ticket.fromCode?.toLowerCase().includes(query);
                const matchesToCode = ticket.toCode?.toLowerCase().includes(query);

                if (!matchesFrom && !matchesTo && !matchesVendor && !matchesMode && !matchesFromCode && !matchesToCode) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === "price") {
                return a.price - b.price;
            }
            if (sortBy === "price-desc") {
                return b.price - a.price;
            }
            if (sortBy === "date") {
                return new Date(a.departureDateTime).getTime() - new Date(b.departureDateTime).getTime();
            }
            return 0;
        });
    }, [transport, fare, searchQuery, sortBy]);

    return (
        <main className="min-h-svh bg-[#080f1d] text-slate-100">
            <div className="mx-auto max-w-[1260px] px-5 pb-20 pt-12 sm:px-8 lg:pt-14">
                {/* Header section */}
                <div>
                    <p className="m-0 text-[10px] font-medium uppercase tracking-[0.18em] text-[#dd7845]">
                        Admin approved
                    </p>
                    <h1 className="mt-3 font-serif text-[44px] font-normal leading-none text-slate-100 sm:text-[50px]">
                        All tickets
                    </h1>
                    <p className="mt-3 text-[14px] text-slate-500">
                        Browse every available route - filtered, sorted, and ready to book.
                    </p>
                </div>

                {/* Transport category pill buttons */}
                <div className="mt-8 flex flex-wrap gap-2">
                    {transportTypes.map(type => (
                        <button
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] transition-colors ${transport === type ? "border-[#dd7845] bg-[#dd7845] text-white" : "border-[#2b374c] bg-[#1b2434] text-slate-400 hover:border-slate-500 hover:text-slate-200"}`}
                            key={type}
                            onClick={() => setTransport(type)}
                            type="button"
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Search, fare filter, sort, and view switch bar */}
                <div className="mt-8 rounded-2xl border border-[#26344a] bg-[#151f32] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search input */}
                        <label className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-[#26344a] bg-[#172235] px-3 text-[12px] text-slate-500 focus-within:border-[#dd7845] transition-colors">
                            <Search aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                            <input
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-200 outline-none placeholder:text-slate-500"
                                name="search"
                                placeholder="Search city, operator..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-[11px] text-slate-400 hover:text-slate-200"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </label>

                        {/* Fare class filter buttons */}
                        <fieldset className="flex h-9 items-center rounded-xl border border-[#26344a] bg-[#172235] p-1">
                            <legend className="sr-only">Fare class</legend>
                            <div className="flex items-center gap-0.5">
                                {fareClasses
                                    .filter(type => transport !== "Bus" || type !== "First")
                                    .map(type => (
                                        <button
                                            className={`rounded-lg px-3 py-1.5 text-[10px] transition-colors ${fare === type ? "bg-[#dd7845] text-white" : "text-slate-500 hover:text-slate-200"}`}
                                            key={type}
                                            onClick={() => setFare(type)}
                                            type="button"
                                        >
                                            {type}
                                        </button>
                                    ))}
                            </div>
                        </fieldset>

                        {/* Sort select */}
                        <label className="flex h-9 items-center gap-1.5 rounded-xl border border-[#26344a] bg-[#172235] px-3 text-[12px] text-slate-400 focus-within:border-[#dd7845] transition-colors cursor-pointer">
                            <Filter aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-slate-400">Sort:</span>
                            <select
                                className="bg-transparent text-[12px] text-slate-200 outline-none cursor-pointer pr-1"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                aria-label="Sort tickets"
                            >
                                <option value="price" className="bg-[#172235] text-slate-200">
                                    Price (Lowest)
                                </option>
                                <option value="price-desc" className="bg-[#172235] text-slate-200">
                                    Price (Highest)
                                </option>
                                <option value="date" className="bg-[#172235] text-slate-200">
                                    Departure time
                                </option>
                            </select>
                            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </label>

                        {/* List and Grid view toggles */}
                        <div className="flex h-9 items-center gap-1 rounded-xl border border-[#26344a] bg-[#172235] p-1">
                            <button
                                className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${viewMode === "list" ? "bg-[#202d40] text-slate-200" : "text-slate-500 hover:text-slate-200"}`}
                                type="button"
                                aria-label="List view"
                                onClick={() => setViewMode("list")}
                            >
                                <List aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                            <button
                                className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#202d40] text-slate-200" : "text-slate-500 hover:text-slate-200"}`}
                                type="button"
                                aria-label="Grid view"
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Counter and active filters summary */}
                <div className="mt-8 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <p>
                        {filteredTickets.length} {filteredTickets.length === 1 ? "ticket" : "tickets"} found
                        {(transport !== "All" || fare !== "All" || searchQuery) && (
                            <span className="ml-2 text-slate-500">
                                (filtered from {tickets.length} total)
                            </span>
                        )}
                    </p>
                    {(transport !== "All" || fare !== "All" || searchQuery) && (
                        <button
                            type="button"
                            onClick={() => {
                                setTransport("All");
                                setFare("All");
                                setSearchQuery("");
                            }}
                            className="text-[#dd7845] transition-colors hover:underline hover:text-[#ef8a53]"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* 15 Ticket cards rendering */}
                {filteredTickets.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                : "mt-6 flex flex-col gap-4"
                        }
                    >
                        {filteredTickets.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 rounded-2xl border border-dashed border-[#26344a] bg-[#111c2e]/60 p-12 text-center">
                        <p className="text-base font-medium text-slate-300">No tickets found</p>
                        <p className="mt-1.5 text-xs text-slate-500">
                            Try adjusting your transport type, fare class, or search terms.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setTransport("All");
                                setFare("All");
                                setSearchQuery("");
                            }}
                            className="mt-4 inline-flex items-center rounded-lg bg-[#dd7845] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#ef8a53]"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

