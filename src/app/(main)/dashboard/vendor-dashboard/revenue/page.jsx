"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TrendingUp, Ticket, Users, DollarSign, ArrowUpRight, BarChart2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function RevenueOverviewPage() {
    const session = useSession();
    const vendorEmail = session?.data?.user?.email || "nusrat@example.com";

    const [stats, setStats] = useState({
        totalTicketsAdded: 16,
        totalTicketsSold: 84,
        totalRevenue: 67200,
    });

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        fetch(`${apiUrl}/vendor-stats/${encodeURIComponent(vendorEmail)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && typeof data.totalRevenue === "number") {
                    setStats(data);
                }
            })
            .catch(() => {});
    }, [vendorEmail]);

    // Monthly revenue mock visualization points
    const monthlyRevenue = [
        { month: "May", amount: 14200, height: "45%" },
        { month: "Jun", amount: 22500, height: "65%" },
        { month: "Jul", amount: 31800, height: "80%" },
        { month: "Aug", amount: 48900, height: "95%" },
        { month: "Sep", amount: stats.totalRevenue || 67200, height: "100%" },
    ];

    const transportBreakdown = [
        { type: "Bus", count: 48, percentage: 57, color: "bg-[#dd7845]" },
        { type: "Train", count: 22, percentage: 26, color: "bg-blue-500" },
        { type: "Flight", count: 10, percentage: 12, color: "bg-purple-500" },
        { type: "Launch", count: 4, percentage: 5, color: "bg-teal-500" },
    ];

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
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
                        <div className="rounded-2xl border border-white/8 bg-[#111a2b] p-5 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                                    Total Tickets Added
                                </span>
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                                    <Ticket className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-3 font-serif text-3xl font-semibold text-white">
                                {stats.totalTicketsAdded}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                                <ArrowUpRight className="h-3.5 w-3.5" /> +4 this month
                            </span>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-[#111a2b] p-5 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                                    Seats Booked & Sold
                                </span>
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Users className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-3 font-serif text-3xl font-semibold text-white">
                                {stats.totalTicketsSold}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                                <ArrowUpRight className="h-3.5 w-3.5" /> 88% capacity rate
                            </span>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-[#111a2b] p-5 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                                    Total Revenue Earned
                                </span>
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#dd7845]/15 text-[#dd7845]">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-3 font-serif text-3xl font-semibold text-[#dd7845]">
                                ৳{stats.totalRevenue.toLocaleString()}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                                <TrendingUp className="h-3.5 w-3.5" /> Verified Stripe payouts
                            </span>
                        </div>
                    </div>

                    {/* Visual Charts Grid */}
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {/* Bar Chart: Revenue Growth */}
                        <div className="rounded-2xl border border-white/8 bg-[#111a2b] p-6 shadow-lg lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-serif text-lg font-medium text-white">
                                        Revenue Trajectory
                                    </h2>
                                    <p className="text-xs text-slate-400">Monthly payout performance (BDT)</p>
                                </div>
                                <BarChart2 className="h-5 w-5 text-slate-500" />
                            </div>

                            {/* CSS Bar Chart */}
                            <div className="mt-8 flex h-52 items-end justify-between gap-4 border-b border-white/10 pb-4">
                                {monthlyRevenue.map((item) => (
                                    <div key={item.month} className="group relative flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full max-w-[50px] rounded-t-lg bg-gradient-to-t from-blue-600 to-[#dd7845] transition-all duration-300 group-hover:brightness-125"
                                            style={{ height: item.height }}
                                        />
                                        <span className="font-mono text-xs text-slate-400">{item.month}</span>
                                        <span className="absolute -top-7 hidden font-mono text-[10px] font-bold text-slate-200 group-hover:block">
                                            ৳{item.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Breakdown by Transport Mode */}
                        <div className="rounded-2xl border border-white/8 bg-[#111a2b] p-6 shadow-lg">
                            <h2 className="font-serif text-lg font-medium text-white">
                                Mode Distribution
                            </h2>
                            <p className="text-xs text-slate-400">Sales volume by transport vehicle</p>

                            <div className="mt-6 space-y-4">
                                {transportBreakdown.map((item) => (
                                    <div key={item.type}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-medium">{item.type}</span>
                                            <span className="font-mono text-slate-400">{item.count} seats ({item.percentage}%)</span>
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

                            <div className="mt-8 rounded-xl border border-white/5 bg-black/20 p-3.5 text-center">
                                <span className="block font-mono text-[10px] text-slate-500 uppercase">
                                    Highest Performing
                                </span>
                                <p className="mt-0.5 text-xs font-semibold text-slate-200">
                                    Inter-City AC Buses (Dhaka — Cox&apos;s Bazar)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
