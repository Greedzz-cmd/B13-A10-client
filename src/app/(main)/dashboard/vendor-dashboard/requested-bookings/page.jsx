"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const INITIAL_REQUESTS = [
    {
        _id: "req-1",
        userName: "Rahim Chowdhury",
        userEmail: "rahim.chowdhury@gmail.com",
        ticketTitle: "Cox's Bazar Express (Train)",
        quantity: 2,
        totalPrice: 1500,
        status: "pending",
        departs: "2026-10-08T10:00:00",
    },
    {
        _id: "req-2",
        userName: "Sadia Afrin",
        userEmail: "sadia.afrin@outlook.com",
        ticketTitle: "Regent Airways (Flight)",
        quantity: 1,
        totalPrice: 3100,
        status: "accepted",
        departs: "2026-10-22T13:15:00",
    },
    {
        _id: "req-3",
        userName: "Tanvir Ahmed",
        userEmail: "tanvir99@yahoo.com",
        ticketTitle: "Speedboat Express (Launch)",
        quantity: 4,
        totalPrice: 1680,
        status: "rejected",
        departs: "2026-11-05T07:00:00",
    },
];

const statusStyles = {
    accepted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    paid: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
};

export default function RequestedBookingsPage() {
    const session = useSession();
    const vendorEmail = session?.data?.user?.email || "nusrat@example.com";

    const [bookings, setBookings] = useState(INITIAL_REQUESTS);
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        fetch(`${apiUrl}/bookings?vendorEmail=${encodeURIComponent(vendorEmail)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setBookings(data);
                }
            })
            .catch(() => {});
    }, [vendorEmail]);

    const handleUpdateStatus = async (id, newStatus) => {
        const previous = bookings;
        setBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            try {
                const res = await fetch(`${apiUrl}/bookings/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
                if (!res.ok) throw new Error("Failed to update status");
            } catch {
                setBookings(previous);
                setActionMessage("Failed to update request on server.");
                return;
            }
        }
        setActionMessage(`Booking request marked as ${newStatus}.`);
        setTimeout(() => setActionMessage(""), 3000);
    };

    const pendingCount = bookings.filter((b) => b.status === "pending").length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
            <Sidebar role="vendor" activeId="requested-bookings" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
                                Vendor workspace
                            </p>
                            <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-white">
                                Requested Bookings
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Manage customer reservation requests · {pendingCount} pending review
                            </p>
                        </div>
                        {actionMessage && (
                            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                                {actionMessage}
                            </span>
                        )}
                    </header>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#131d31]">
                        <table className="w-full min-w-[820px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">Customer</th>
                                    <th className="px-4 py-3.5">Ticket Title</th>
                                    <th className="px-4 py-3.5">Seats</th>
                                    <th className="px-4 py-3.5">Total Price</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {bookings.map((b) => {
                                    const isPending = b.status === "pending";
                                    return (
                                        <tr key={b._id} className="transition-colors hover:bg-white/[0.02]">
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium text-slate-200">{b.userName}</p>
                                                <p className="font-mono text-[11px] text-slate-400">{b.userEmail}</p>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-300">
                                                {b.ticketTitle}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-200">
                                                {b.quantity} seat(s)
                                            </td>
                                            <td className="px-4 py-3.5 font-mono font-medium text-[#dd7845]">
                                                ৳{Number(b.totalPrice).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${
                                                        statusStyles[b.status] || statusStyles.pending
                                                    }`}
                                                >
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateStatus(b._id, "accepted")}
                                                        disabled={b.status === "accepted"}
                                                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Check className="h-3 w-3" /> Accept
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateStatus(b._id, "rejected")}
                                                        disabled={b.status === "rejected"}
                                                        className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2.5 py-1 text-[10px] font-medium text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <X className="h-3 w-3" /> Reject
                                                    </button>
                                                </div>
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
