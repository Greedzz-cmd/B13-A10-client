"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Ticket, Users, DollarSign, BarChart2 } from "lucide-react";
import { authenticatedFetch, readJson } from "@/lib/api-client";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MODE_COLORS = {
    Bus: "bg-brand",
    Train: "bg-blue-500",
    Flight: "bg-purple-500",
    Launch: "bg-teal-500",
};

function KpiCard({ label, value, hint, valueClass, iconClass, children }) {
    return (
        <div className="rounded-2xl border border-hairline/8 bg-[var(--surface-inset)] p-5 shadow-lg">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    {label}
                </span>
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${iconClass}`}>{children}</div>
            </div>
            <p className={`mt-3 font-serif text-3xl font-semibold ${valueClass}`}>{value}</p>
            {hint && <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">{hint}</span>}
        </div>
    );
}

export default function RevenueOverviewPage() {
    const [stats, setStats] = useState(null);
    const [ownTickets, setOwnTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // /vendor-stats is role-guarded, so it needs the session's bearer token.
    const load = useCallback(async () => {
        const [statsRes, ticketsRes] = await Promise.all([
            authenticatedFetch("/vendor-stats"),
            authenticatedFetch("/tickets/me?limit=100"),
        ]);
        const statsBody = await readJson(statsRes);
        // Mode distribution is a nice-to-have; a failure there must not blank
        // the revenue figures.
        const ticketsBody = await readJson(ticketsRes).catch(() => null);

        return {
            stats: statsBody,
            tickets: ticketsBody?.tickets || [],
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        load()
            .then(({ stats: body, tickets }) => {
                if (cancelled) return;
                setStats(body);
                setOwnTickets(tickets);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [load]);

    // The server groups by "YYYY-MM"; label the bars with a real month name.
    const monthlyRevenue = useMemo(() => {
        const rows = stats?.monthlyRevenue || [];
        const peak = Math.max(...rows.map((r) => r.revenue), 0);

        return rows.map((row) => {
            const [year, month] = row.month.split("-");
            const label = `${MONTHS[Number(month) - 1] ?? month} ${year.slice(2)}`;

            return {
                key: row.month,
                label,
                amount: row.revenue,
                tickets: row.tickets,
                // Percentage of the best month, so the tallest bar fills the
                // chart even when every month is small.
                height: peak > 0 ? `${Math.max((row.revenue / peak) * 100, 4)}%` : "4%",
            };
        });
    }, [stats]);

    const modeDistribution = useMemo(() => {
        const totals = new Map();

        for (const ticket of ownTickets) {
            const mode = ticket.transportType || "Other";
            totals.set(mode, (totals.get(mode) || 0) + 1);
        }

        const sum = [...totals.values()].reduce((acc, n) => acc + n, 0);

        return [...totals.entries()]
            .map(([type, count]) => ({
                type,
                count,
                percentage: sum > 0 ? Math.round((count / sum) * 100) : 0,
                color: MODE_COLORS[type] || "bg-slate-500",
            }))
            .sort((a, b) => b.count - a.count);
    }, [ownTickets]);

    const topMode = modeDistribution[0];

    if (isLoading) {
        return (
            <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
                <Sidebar role="vendor" activeId="revenue" />
                <main className="min-w-0 flex-1 p-5 pb-24 sm:p-8 lg:p-10 md:pb-10">
                    <p className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-16 text-center text-xs text-slate-500">
                        Loading revenue…
                    </p>
                </main>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
                <Sidebar role="vendor" activeId="revenue" />
                <main className="min-w-0 flex-1 p-5 pb-24 sm:p-8 lg:p-10 md:pb-10">
                    <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-16 text-center text-xs text-red-300">
                        {loadError}
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
            <Sidebar role="vendor" activeId="revenue" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-7">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
                            Vendor workspace
                        </p>
                        <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-white">
                            Revenue Overview
                        </h1>
                        <p className="mt-1 text-xs text-slate-400">
                            Track tickets added, seats booked, and earned revenue over time.
                        </p>
                    </header>

                    {/* Top KPI Cards */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <KpiCard
                            label="Total Tickets Added"
                            value={(stats.totalTicketsAdded ?? 0).toLocaleString()}
                            iconClass="bg-blue-500/10 text-blue-400"
                            valueClass="text-white"
                        >
                            <Ticket className="h-4 w-4" />
                        </KpiCard>

                        <KpiCard
                            label="Seats Booked & Sold"
                            value={(stats.totalTicketsSold ?? 0).toLocaleString()}
                            hint={`of ${(stats.totalSeats ?? 0).toLocaleString()} listed`}
                            iconClass="bg-emerald-500/10 text-emerald-400"
                            valueClass="text-white"
                        >
                            <Users className="h-4 w-4" />
                        </KpiCard>

                        <KpiCard
                            label="Total Revenue Earned"
                            value={`৳${(stats.totalRevenue ?? 0).toLocaleString()}`}
                            hint={`across ${stats.totalBookings ?? 0} booking${stats.totalBookings === 1 ? "" : "s"}`}
                            iconClass="bg-brand/15 text-[var(--accent-ink)]"
                            valueClass="text-[var(--accent-ink)]"
                        >
                            <DollarSign className="h-4 w-4" />
                        </KpiCard>
                    </div>

                    {/* Visual Charts Grid */}
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {/* Bar Chart: Revenue Growth */}
                        <div className="rounded-2xl border border-hairline/8 bg-[var(--surface-inset)] p-6 shadow-lg lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-serif text-lg font-medium text-white">
                                        Revenue Trajectory
                                    </h2>
                                    <p className="text-xs text-slate-400">Monthly payout performance (BDT)</p>
                                </div>
                                <BarChart2 className="h-5 w-5 text-slate-500" />
                            </div>

                            {monthlyRevenue.length === 0 ? (
                                <p className="mt-8 rounded-xl border border-hairline/5 bg-shade/20 px-4 py-14 text-center text-xs text-slate-500">
                                    No paid sales yet. Revenue appears here once a booking is paid.
                                </p>
                            ) : (
                                /* CSS Bar Chart */
                                <div className="mt-8 flex h-52 items-end justify-between gap-4 border-b border-hairline/10 pb-4">
                                    {monthlyRevenue.map((item) => (
                                        <div key={item.key} className="group relative flex flex-1 flex-col items-center gap-2">
                                            <div className="w-full max-w-[50px] rounded-t-lg bg-gradient-to-t from-blue-600 to-brand transition-all duration-300 group-hover:brightness-125"
                                                style={{ height: item.height }}
                                            />
                                            <span className="font-mono text-[10px] text-slate-400">{item.label}</span>
                                            <span className="absolute -top-7 hidden whitespace-nowrap font-mono text-[10px] font-bold text-slate-200 group-hover:block">
                                                ৳{item.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Breakdown by Transport Mode */}
                        <div className="rounded-2xl border border-hairline/8 bg-[var(--surface-inset)] p-6 shadow-lg">
                            <h2 className="font-serif text-lg font-medium text-white">
                                Mode Distribution
                            </h2>
                            <p className="text-xs text-slate-400">Your listings by transport vehicle</p>

                            {modeDistribution.length === 0 ? (
                                <p className="mt-6 rounded-xl border border-hairline/5 bg-shade/20 px-4 py-10 text-center text-xs text-slate-500">
                                    Add a ticket to see this breakdown.
                                </p>
                            ) : (
                                <>
                                    <div className="mt-6 space-y-4">
                                        {modeDistribution.map((item) => (
                                            <div key={item.type}>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-300 font-medium">{item.type}</span>
                                                    <span className="font-mono text-slate-400">{item.count} ticket{item.count === 1 ? "" : "s"} ({item.percentage}%)</span>
                                                </div>
                                                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                                    <div
                                                        className={`h-full rounded-full ${item.color}`}
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 rounded-xl border border-hairline/5 bg-shade/20 p-3.5 text-center">
                                        <span className="block font-mono text-[10px] text-slate-500 uppercase">
                                            Most Listed Mode
                                        </span>
                                        <p className="mt-0.5 text-xs font-semibold text-slate-200">
                                            {topMode.type} ({topMode.count})
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {stats.recentTransactions?.length > 0 && (
                        <section className="mt-6 rounded-2xl border border-hairline/8 bg-[var(--surface-inset)] p-6 shadow-lg">
                            <h2 className="font-serif text-lg font-medium text-white">Recent Sales</h2>
                            <ul className="mt-4 divide-y divide-hairline/5">
                                {stats.recentTransactions.map((sale) => (
                                    <li key={sale._id ?? sale.bookingId} className="flex items-center justify-between gap-4 py-3 text-xs">
                                        <span className="min-w-0 truncate text-slate-300">{sale.ticketTitle || sale.route || "Booking"}</span>
                                        <span className="font-mono text-slate-500">
                                            {sale.quantity} seat{sale.quantity === 1 ? "" : "s"}
                                        </span>
                                        <span className="font-mono text-[var(--accent-ink)]">৳{sale.amount.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
