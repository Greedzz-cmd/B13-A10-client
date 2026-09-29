"use client";

import { ChevronDown, Filter, LayoutGrid, List, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import TicketCard from "./TicketCard";

const transportTypes = ["All", "Flight", "Train", "Bus", "Launch"];
const fareClasses = ["All", "Economy", "Business", "First"];

const sortOptions = [
    { value: "price-asc", label: "Price (lowest)" },
    { value: "price-desc", label: "Price (highest)" },
    { value: "departing-soon", label: "Departing soon" },
    { value: "newest", label: "Newest listed" },
];

/** Maps the server sort key onto the label the select shows. */
const sortLabel = (value) => sortOptions.find((option) => option.value === value)?.label ?? "Sort";

export default function TicketsPage({
    tickets = [],
    pagination = {},
    locations = { from: [], to: [] },
    filters = {},
    itemsPerPage = 9,
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [viewMode, setViewMode] = useState("grid");

    // Local mirror of the URL state so typing stays responsive; each change is
    // pushed to the server, which re-queries and re-renders with fresh rows.
    const [fromValue, setFromValue] = useState(filters.from || "");
    const [toValue, setToValue] = useState(filters.to || "");
    const [searchValue, setSearchValue] = useState(filters.query || "");

    // Resync when the URL changes from outside this component, such as a
    // browser back navigation. Done during render rather than in an effect so
    // it does not trigger a second cascading render.
    const urlKey = `${filters.from || ""}|${filters.to || ""}|${filters.query || ""}`;
    const [lastUrlKey, setLastUrlKey] = useState(urlKey);

    if (urlKey !== lastUrlKey) {
        setLastUrlKey(urlKey);
        setFromValue(filters.from || "");
        setToValue(filters.to || "");
        setSearchValue(filters.query || "");
    }

    const page = pagination.page || 1;
    const total = pagination.total || 0;
    const totalPages = pagination.totalPages || 1;
    const hasFilters = Boolean(
        (filters.from || filters.to || filters.query) ||
        (filters.transport && filters.transport !== "All") ||
        (filters.fare && filters.fare !== "All"),
    );

    /** Writes the given filter overrides to the URL and re-queries the server. */
    const applyFilters = (overrides, { resetPage = true } = {}) => {
        const next = {
            transport: filters.transport,
            fare: filters.fare,
            sort: filters.sort,
            from: filters.from,
            to: filters.to,
            query: filters.query,
            ...overrides,
        };

        const params = new URLSearchParams();

        if (next.from) params.set("from", next.from);
        if (next.to) params.set("to", next.to);
        if (next.transport && next.transport !== "All") params.set("transport", next.transport);
        if (next.fare && next.fare !== "All") params.set("fare", next.fare);
        if (next.query) params.set("q", next.query);
        if (next.sort && next.sort !== "price-asc") params.set("sort", next.sort);
        if (!resetPage && page > 1) params.set("page", String(page));

        const query = params.toString();

        startTransition(() => {
            router.replace(query ? `/tickets?${query}` : "/tickets", { scroll: false });
        });
    };

    // Debounce the free text and location inputs so a search does not fire a
    // request per keystroke.
    // Debounce the free text and location inputs so a search does not fire a
    // request per keystroke.
    const debounceRef = useRef(null);

    const scheduleDebouncedFilter = (key, value) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            applyFilters({ [key]: value });
        }, 400);
    };

    useEffect(() => () => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
    }, []);

    const resetFilters = () => {
        setFromValue("");
        setToValue("");
        setSearchValue("");
        startTransition(() => router.replace("/tickets", { scroll: false }));
    };

    const goToPage = (target) => {
        const next = Math.min(Math.max(target, 1), totalPages);
        const params = new URLSearchParams();

        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);
        if (filters.transport && filters.transport !== "All") params.set("transport", filters.transport);
        if (filters.fare && filters.fare !== "All") params.set("fare", filters.fare);
        if (filters.query) params.set("q", filters.query);
        if (filters.sort && filters.sort !== "price-asc") params.set("sort", filters.sort);
        if (next > 1) params.set("page", String(next));

        const query = params.toString();

        startTransition(() => {
            router.replace(query ? `/tickets?${query}` : "/tickets", { scroll: false });
        });
    };

    const firstResult = total === 0 ? 0 : (page - 1) * (pagination.limit || itemsPerPage) + 1;
    const lastResult = Math.min(page * (pagination.limit || itemsPerPage), total);

    return (
        <main className="min-h-svh bg-[var(--surface-canvas)] text-slate-100">
            <div
                className={`mx-auto max-w-[1260px] px-5 pb-20 pt-12 transition-opacity duration-200 sm:px-8 lg:pt-14 ${
                    isPending ? "opacity-60" : "opacity-100"
                }`}
                aria-busy={isPending}
            >
                <div>
                    <p className="m-0 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
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
                <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Transport type">
                    {transportTypes.map((type) => (
                        <button
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] transition-colors ${
                                filters.transport === type
                                    ? "border-brand bg-brand text-white"
                                    : "border-[var(--line)] bg-[var(--surface)] text-slate-400 hover:border-slate-500 hover:text-slate-200"
                            }`}
                            key={type}
                            onClick={() => applyFilters({ transport: type })}
                            type="button"
                            aria-pressed={filters.transport === type}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] text-slate-500 transition-colors focus-within:border-brand">
                            <Search aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                            <input
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-200 outline-none placeholder:text-slate-500"
                                name="q"
                                placeholder="Search city, operator..."
                                value={searchValue}
                                onChange={(event) => {
                                    setSearchValue(event.target.value);
                                    scheduleDebouncedFilter("query", event.target.value);
                                }}
                                aria-label="Search tickets"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchValue("");
                                        applyFilters({ query: "" });
                                    }}
                                    className="text-[11px] text-slate-400 hover:text-slate-200"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </label>

                        <fieldset className="flex h-9 items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
                            <legend className="sr-only">Fare class</legend>
                            <div className="flex items-center gap-0.5">
                                {fareClasses
                                    .filter((type) => filters.transport !== "Bus" || type !== "First")
                                    .map((type) => (
                                        <button
                                            className={`rounded-lg px-3 py-1.5 text-[10px] transition-colors ${
                                                filters.fare === type
                                                    ? "bg-brand text-white"
                                                    : "text-slate-500 hover:text-slate-200"
                                            }`}
                                            key={type}
                                            onClick={() => applyFilters({ fare: type })}
                                            type="button"
                                            aria-pressed={filters.fare === type}
                                        >
                                            {type}
                                        </button>
                                    ))}
                            </div>
                        </fieldset>

                        <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] text-slate-400 transition-colors focus-within:border-brand">
                            <Filter aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-slate-400">Sort:</span>
                            <select
                                className="cursor-pointer bg-transparent pr-1 text-[12px] text-slate-200 outline-none"
                                value={filters.sort}
                                onChange={(event) => applyFilters({ sort: event.target.value })}
                                aria-label="Sort tickets"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-[var(--surface)] text-slate-200">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown aria-hidden="true" className="pointer-events-none h-3.5 w-3.5 text-slate-400" />
                        </label>

                        <div className="flex h-9 items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
                            <button
                                className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                                    viewMode === "list"
                                        ? "bg-[var(--surface-raised)] text-slate-200"
                                        : "text-slate-500 hover:text-slate-200"
                                }`}
                                type="button"
                                aria-label="List view"
                                aria-pressed={viewMode === "list"}
                                onClick={() => setViewMode("list")}
                            >
                                <List aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                            <button
                                className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-[var(--surface-raised)] text-slate-200"
                                        : "text-slate-500 hover:text-slate-200"
                                }`}
                                type="button"
                                aria-label="Grid view"
                                aria-pressed={viewMode === "grid"}
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Route filter inputs, fed by the locations the API reports */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-hairline/5 pt-2.5">
                        <label className="flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] transition-colors focus-within:border-brand">
                            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">From</span>
                            <input
                                list="routely-from-locations"
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-200 outline-none placeholder:text-slate-500"
                                value={fromValue}
                                placeholder="Any origin"
                                onChange={(event) => {
                                    setFromValue(event.target.value);
                                    scheduleDebouncedFilter("from", event.target.value);
                                }}
                                aria-label="Filter by origin"
                            />
                        </label>
                        <label className="flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] transition-colors focus-within:border-brand">
                            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">To</span>
                            <input
                                list="routely-to-locations"
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-200 outline-none placeholder:text-slate-500"
                                value={toValue}
                                placeholder="Any destination"
                                onChange={(event) => {
                                    setToValue(event.target.value);
                                    scheduleDebouncedFilter("to", event.target.value);
                                }}
                                aria-label="Filter by destination"
                            />
                        </label>
                        <datalist id="routely-from-locations">
                            {(locations.from || []).map((location) => (
                                <option key={location} value={location} />
                            ))}
                        </datalist>
                        <datalist id="routely-to-locations">
                            {(locations.to || []).map((location) => (
                                <option key={location} value={location} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <p>
                        {total} {total === 1 ? "ticket" : "tickets"} found
                        {hasFilters ? <span className="ml-2 text-slate-500">filtered</span> : null}
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-[var(--accent-ink)] transition-colors hover:underline hover:text-[var(--accent-ink)]"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {hasFilters && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400">Applied:</span>
                        {[
                            filters.transport !== "All" && filters.transport,
                            filters.fare !== "All" && filters.fare,
                            filters.from && `from ${filters.from}`,
                            filters.to && `to ${filters.to}`,
                            filters.query && `“${filters.query}”`,
                            sortLabel(filters.sort) !== "Sort" && sortLabel(filters.sort),
                        ]
                            .filter(Boolean)
                            .map((chip) => (
                                <span
                                    key={chip}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2.5 py-1 font-medium text-[var(--accent-ink)]"
                                >
                                    {chip}
                                </span>
                            ))}
                    </div>
                )}

                {tickets.length > 0 ? (
                    <>
                        <div
                            className={
                                viewMode === "grid"
                                    ? "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                    : "mt-6 flex flex-col gap-4"
                            }
                        >
                            {tickets.map((ticket) => (
                                <TicketCard key={ticket._id} ticket={ticket} viewMode={viewMode} />
                            ))}
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-hairline/5 pt-6 font-mono text-xs text-slate-400">
                            <div>
                                Showing {firstResult}–{lastResult} of {total} tickets
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => goToPage(page - 1)}
                                        disabled={page === 1 || isPending}
                                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-hairline/10 bg-[var(--surface)] px-2.5 text-slate-300 transition hover:bg-hairline/10 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                                    </button>

                                    <span className="px-2 tabular-nums">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => goToPage(page + 1)}
                                        disabled={page === totalPages || isPending}
                                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-hairline/10 bg-[var(--surface)] px-2.5 text-slate-300 transition hover:bg-hairline/10 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-12 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]/60 p-12 text-center">
                        <p className="text-base font-medium text-slate-300">No tickets found</p>
                        <p className="mt-1.5 text-xs text-slate-500">
                            {hasFilters
                                ? "Try adjusting your transport type, fare class, or search terms."
                                : "No approved tickets are listed yet. Please check back shortly."}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 inline-flex items-center rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition hover:bg-brand-hover"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
