"use client";

import { useCallback, useEffect, useState } from "react";
import { BusFront, Check, Plane, Ship, TrainFront, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ManageTicketList } from "./ManageTicketList";
import { authenticatedFetch, moderateTicket, readJson } from "@/lib/api-client";


const modeIcons = {
    flight: Plane,
    train: TrainFront,
    launch: Ship,
    bus: BusFront,
};

const statusStyles = {
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-red-500/15 text-red-400",
    pending: "bg-amber-500/15 text-amber-400",
};

function MetricCard({ label, value, valueClass }) {
    return (
        <div className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-3.5 sm:px-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className={`mt-2 font-serif text-xl ${valueClass}`}>{value}</p>
        </div>
    );
}

function Banner({ tone = "error", children }) {
    if (!children) return null;
    return (
        <p
            role={tone === "error" ? "alert" : "status"}
            className={`rounded-lg border px-3 py-2 text-xs ${
                tone === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
        >
            {children}
        </p>
    );
}

export default function ManageTicketsClient() {
    const [tickets, setTickets] = useState([]);
    const [userCount, setUserCount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [errorId, setErrorId] = useState(null);
    const [notice, setNotice] = useState(null);

    // The admin table needs pending and rejected rows too, which the public
    // /tickets endpoint never returns, so this has to be the authenticated
    // /tickets/manage listing.
    const fetchTickets = useCallback(async () => {
        const [ticketRes, statsRes] = await Promise.all([
            authenticatedFetch("/tickets/manage?limit=100&sort=newest"),
            authenticatedFetch("/admin-stats"),
        ]);
        const ticketBody = await readJson(ticketRes);

        // A failure to read the stats should not hide the ticket table.
        const stats = await readJson(statsRes).catch(() => null);

        return {
            rows: (ticketBody.tickets || []).map((ticket, index) => ({
                ...ticket,
                id: ticket._id ?? ticket.id ?? `${ticket.from}-${ticket.to}-${index}`,
            })),
            userCount: stats
                ? Object.values(stats.users || {}).reduce((sum, n) => sum + n, 0)
                : null,
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetchTickets()
            .then(({ rows, userCount: total }) => {
                if (cancelled) return;
                setTickets(rows);
                setUserCount(total);
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
    }, [fetchTickets]);

    async function reload() {
        setIsLoading(true);
        setLoadError(null);

        try {
            const { rows, userCount: total } = await fetchTickets();
            setTickets(rows);
            setUserCount(total);
        } catch (err) {
            setLoadError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function setStatus(id, status) {
        const previous = tickets;
        // Optimistic update so the UI feels instant
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, verificationStatus: status } : t)));
        setErrorId(null);
        setNotice(null);

        try {
            // Moderation is its own endpoint: PATCH /tickets/:id only accepts
            // the fields a vendor owns and quietly drops verificationStatus.
            const { ticket } = await moderateTicket(id, status === "approved" ? "approve" : "reject");
            setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...ticket, id: t.id } : t)));
            setNotice(`Ticket ${status}.`);
        } catch (err) {
            // Roll back on failure
            setTickets(previous);
            setErrorId(id);
            setNotice(err.message);
        }
    }

    const pendingCount = tickets.filter((t) => (t.verificationStatus || "pending").toLowerCase() === "pending").length;
    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
            <Sidebar role="admin" activeId="manage-tickets" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-[1180px]">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ticket metrics">
                        <MetricCard label="Total tickets" value={String(tickets.length)} valueClass="text-[var(--accent-ink)]" />
                        <MetricCard label="Pending review" value={String(pendingCount)} valueClass="text-amber-400" />
                        <MetricCard label="Total users" value={userCount === null ? "—" : String(userCount)} valueClass="text-teal-400" />
                        <MetricCard label="Advertised" value={`${advertisedCount} / ${tickets.length}`} valueClass="text-purple-300" />
                    </section>

                    <header className="mb-5 mt-7">
                        <h1 className="font-serif text-3xl font-medium tracking-[-0.04em] text-slate-100">Manage Tickets</h1>
                        <p className="mt-1 text-xs text-slate-500">{tickets.length} tickets · {pendingCount} pending review</p>
                    </header>

                    <div className="mb-4 grid gap-2">
                        {loadError ? (
                            <div
                                role="alert"
                                className="flex flex-wrap items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                            >
                                <span>{loadError}</span>
                                <button
                                    type="button"
                                    onClick={reload}
                                    className="rounded-md border border-red-500/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition hover:bg-red-500/20"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : errorId ? (
                            <Banner tone="error">That action could not be saved. No change was made.</Banner>
                        ) : null}
                        <Banner tone="success">{notice}</Banner>
                    </div>

                    {isLoading ? (
                        <p className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            Loading tickets…
                        </p>
                    ) : tickets.length === 0 ? (
                        <p className="rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            No tickets have been submitted yet.
                        </p>
                    ) : (
                        <>
                    {/* Mobile card list — hidden on md+ where the table takes over */}
                    <ManageTicketList
                        tickets={tickets}
                        onApprove={(id) => setStatus(id, "approved")}
                        onReject={(id) => setStatus(id, "rejected")}
                    />

                    {/* Desktop table — hidden below md, matches the target screenshot */}
                    <section className="hidden md:block" aria-label="Desktop ticket management table">
                        <div className="overflow-x-auto rounded-xl border border-hairline/8 bg-[var(--surface)]">
                            <table className="w-full min-w-[920px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-hairline/8 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
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
                                            <tr key={ticket.id} className="border-b border-hairline/6 last:border-b-0 hover:bg-hairline/[0.025]">
                                                <td className="px-3 py-3 sm:px-4">
                                                    <p className="text-xs font-medium text-slate-200">{ticket.from} → {ticket.to}</p>
                                                    <p className="font-mono text-[9px] text-slate-500">{ticket.departureDateTime ? new Date(ticket.departureDateTime).toISOString().slice(0, 10) : "N/A"}</p>
                                                </td>
                                                <td className="px-3 py-3 text-xs text-slate-400 sm:px-4">{ticket.vendorName || ticket.title}</td>
                                                <td className="px-3 py-3 text-xs text-slate-300 sm:px-4">
                                                    <span className="inline-flex items-center gap-1.5"><ModeIcon className="h-3 w-3 text-slate-400" />{mode}</span>
                                                </td>
                                                <td className="px-3 py-3 font-mono text-xs text-[var(--accent-ink)] sm:px-4">{ticket.price}</td>
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
                        </>
                    )}
                </div>
            </main>
            <button type="button" className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-hairline/10 bg-[var(--surface)] text-xs font-semibold text-slate-300 shadow-lg transition hover:bg-hairline/15 hover:text-white" aria-label="Help and Support" title="Help & Support">
                ?
            </button>
        </div>
    );
}