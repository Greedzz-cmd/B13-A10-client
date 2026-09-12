"use client";

import { useState } from "react";
import { BusFront, Check, Plane, Ship, TrainFront, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ManageTicketList } from "./ManageTicketList";


const modeIcons = {
    flight: Plane,
    train: TrainFront,
    launch: Ship,
    bus: BusFront,
};

const statusStyles = {
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-red-500/15 text-red-400",
};

function MetricCard({ label, value, valueClass }) {
    return (
        <div className="rounded-xl border border-white/8 bg-[#131d31] px-4 py-3.5 sm:px-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className={`mt-2 font-serif text-xl ${valueClass}`}>{value}</p>
        </div>
    );
}

export default function ManageTicketsClient({ initialTickets }) {
    const [tickets, setTickets] = useState(() => initialTickets.map((ticket, index) => ({
        ...ticket,
        id: ticket._id ?? ticket.id ?? `${ticket.from}-${ticket.to}-${index}`,
    })));
    const [errorId, setErrorId] = useState(null);

    async function setStatus(id, status) {
        const previous = tickets;
        // Optimistic update so the UI feels instant
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, verificationStatus: status } : t)));
        setErrorId(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationStatus: status }),
            });
            if (!res.ok) throw new Error("Request failed");
        } catch (err) {
            // Roll back on failure
            setTickets(previous);
            setErrorId(id);
        }
    }

    const pendingCount = tickets.filter((t) => (t.verificationStatus || "pending").toLowerCase() === "pending").length;
    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
            <Sidebar role="admin" activeId="manage-tickets" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-[1180px]">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ticket metrics">
                        <MetricCard label="Total tickets" value={String(tickets.length)} valueClass="text-[#dd7845]" />
                        <MetricCard label="Pending review" value={String(pendingCount)} valueClass="text-amber-400" />
                        <MetricCard label="Total users" value="6" valueClass="text-teal-400" />
                        <MetricCard label="Advertised" value={`${advertisedCount} / ${tickets.length}`} valueClass="text-purple-300" />
                    </section>

                    <header className="mb-5 mt-7">
                        <h1 className="font-serif text-3xl font-medium tracking-[-0.04em] text-slate-100">Manage Tickets</h1>
                        <p className="mt-1 text-xs text-slate-500">{tickets.length} tickets · {pendingCount} pending review</p>
                    </header>

                    {/* Mobile card list — hidden on md+ where the table takes over */}
                    <ManageTicketList
                        tickets={tickets}
                        onApprove={(id) => setStatus(id, "approved")}
                        onReject={(id) => setStatus(id, "rejected")}
                    />

                    {/* Desktop table — hidden below md, matches the target screenshot */}
                    <section className="hidden md:block" aria-label="Desktop ticket management table">
                        <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#131d31]">
                            <table className="w-full min-w-[920px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-white/8 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                                        <th className="px-3 py-3 sm:px-4">Ticket</th>
                                        <th className="px-3 py-3 sm:px-4">Operator</th>
                                        <th className="px-3 py-3 sm:px-4">Mode</th>
                                        <th className="px-3 py-3 sm:px-4">Price</th>
                                        <th className="px-3 py-3 sm:px-4">Status</th>
                                        <th className="px-3 py-3 sm:px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => {
                                        const mode = ticket.transportType || "Bus";
                                        const ModeIcon = modeIcons[mode.toLowerCase()] || BusFront;
                                        const status = (ticket.verificationStatus || "pending").toLowerCase();
                                        return (
                                            <tr key={ticket.id} className="border-b border-white/6 last:border-b-0 hover:bg-white/[0.025]">
                                                <td className="px-3 py-3 sm:px-4">
                                                    <p className="text-xs font-medium text-slate-200">{ticket.from} → {ticket.to}</p>
                                                    <p className="font-mono text-[9px] text-slate-500">{ticket.departureDateTime ? new Date(ticket.departureDateTime).toISOString().slice(0, 10) : "N/A"}</p>
                                                </td>
                                                <td className="px-3 py-3 text-xs text-slate-400 sm:px-4">{ticket.vendorName || ticket.title}</td>
                                                <td className="px-3 py-3 text-xs text-slate-300 sm:px-4">
                                                    <span className="inline-flex items-center gap-1.5"><ModeIcon className="h-3 w-3 text-slate-400" />{mode}</span>
                                                </td>
                                                <td className="px-3 py-3 font-mono text-xs text-[#dd7845] sm:px-4">{ticket.price}</td>
                                                <td className="px-3 py-3 sm:px-4">
                                                    <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${statusStyles[status] || statusStyles.pending}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 sm:px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setStatus(ticket.id, "approved")}
                                                            disabled={status === "approved"}
                                                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1.5 text-[9px] font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-500/10"
                                                            aria-label={`Approve ${ticket.from} to ${ticket.to}`}
                                                        >
                                                            <Check className="h-3 w-3" />Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStatus(ticket.id, "rejected")}
                                                            disabled={status === "rejected"}
                                                            className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1.5 text-[9px] font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-500/10"
                                                            aria-label={`Reject ${ticket.from} to ${ticket.to}`}
                                                        >
                                                            <X className="h-3 w-3" />Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
            <button type="button" className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#131b2e] text-xs font-semibold text-slate-300 shadow-lg transition hover:bg-white/15 hover:text-white" aria-label="Help and Support" title="Help & Support">
                ?
            </button>
        </div>
    );
}