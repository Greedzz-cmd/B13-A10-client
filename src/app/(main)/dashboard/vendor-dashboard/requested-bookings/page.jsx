"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { authenticatedFetch, readJson } from "@/lib/api-client";

const statusStyles = {
    accepted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    cancelled: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    paid: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
};

export default function RequestedBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [actionMessage, setActionMessage] = useState("");
    const [actionTone, setActionTone] = useState("success");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");

    // /bookings infers the owner from the token, so this call must carry one:
    // an anonymous request would 401 and leave the placeholder rows on screen.
    const fetchBookings = useCallback(async () => {
        const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
        const res = await authenticatedFetch(`/bookings${query}`);

        return readJson(res);
    }, [statusFilter]);

    useEffect(() => {
        let cancelled = false;

        fetchBookings()
            .then((data) => {
                if (!cancelled) setBookings(Array.isArray(data) ? data : []);
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
    }, [fetchBookings]);

    const announce = (message, tone = "success") => {
        setActionTone(tone);
        setActionMessage(message);
        setTimeout(() => setActionMessage(""), 4000);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        const previous = bookings;
        setBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );

        try {
            const res = await authenticatedFetch(`/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            await readJson(res);
            announce(`Booking request marked as ${newStatus}.`);
        } catch (err) {
            setBookings(previous);
            announce(err.message, "error");
        }
    };

    const pendingCount = bookings.filter((b) => b.status === "pending").length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
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
                            <span className={`rounded-lg border px-3 py-1.5 text-xs ${
                                actionTone === "error"
                                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            }`}>
                                {actionMessage}
                            </span>
                        )}
                    </header>

                    <div className="mb-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setIsLoading(true); setStatusFilter(e.target.value); }}
                            aria-label="Filter by status"
                            className="rounded-lg border border-hairline/10 bg-[var(--surface)] px-3 py-2 text-xs text-slate-300 focus:border-[var(--accent-ink)] focus:outline-none"
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="paid">Paid</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <p className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            Loading booking requests…
                        </p>
                    ) : loadError ? (
                        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-10 text-center text-xs text-red-300">
                            {loadError}
                        </p>
                    ) : bookings.length === 0 ? (
                        <p className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            No booking requests{statusFilter ? ` with status "${statusFilter}"` : ""} yet.
                        </p>
                    ) : (
                    /* Table */
                    <div className="overflow-x-auto rounded-xl border border-hairline/8 bg-[var(--surface)]">
                        <table className="w-full min-w-[820px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-hairline/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">Customer</th>
                                    <th className="px-4 py-3.5">Ticket Title</th>
                                    <th className="px-4 py-3.5">Seats</th>
                                    <th className="px-4 py-3.5">Total Price</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/5 text-xs">
                                {bookings.map((b) => {
                                    const isPending = b.status === "pending";
                                    return (
                                        <tr key={b._id} className="transition-colors hover:bg-hairline/[0.02]">
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
                                            <td className="px-4 py-3.5 font-mono font-medium text-[var(--accent-ink)]">
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
                    )}
                </div>
            </main>
        </div>
    );
}
