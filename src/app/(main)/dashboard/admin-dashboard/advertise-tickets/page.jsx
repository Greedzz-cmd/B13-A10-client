"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Megaphone, AlertCircle, Check, Sparkles } from "lucide-react";
import { authenticatedFetch, readJson, setTicketAdvertisement } from "@/lib/api-client";

const ADVERTISEMENT_LIMIT = 6;

export default function AdvertiseTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Only approved tickets can be advertised, which is exactly what the public
    // catalogue returns, so this one is safe to call without a role.
    const fetchTickets = useCallback(async () => {
        const res = await authenticatedFetch("/tickets?limit=100&sort=newest");

        return readJson(res);
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetchTickets()
            .then((data) => {
                if (cancelled) return;
                const rows = Array.isArray(data) ? data : data?.tickets || [];
                setTickets(
                    rows.filter(
                        (t) => (t.verificationStatus || "approved").toLowerCase() === "approved"
                    )
                );
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

    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    const handleToggleAdvertise = async (ticketId, currentStatus) => {
        setErrorMessage("");

        if (!currentStatus && advertisedCount >= ADVERTISEMENT_LIMIT) {
            setErrorMessage(`Cannot advertise more than ${ADVERTISEMENT_LIMIT} tickets at a time.`);
            return;
        }

        const newStatus = !currentStatus;
        const previousTickets = tickets;

        setTickets((prev) =>
            prev.map((t) =>
                (t._id === ticketId || t.id === ticketId)
                    ? { ...t, isAdvertised: newStatus }
                    : t
            )
        );

        try {
            // Advertisement has a dedicated endpoint; PATCH /tickets/:id only
            // accepts the fields a vendor owns and drops the flag.
            await setTicketAdvertisement(ticketId, newStatus);
        } catch (err) {
            setTickets(previousTickets);
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
            <Sidebar role="admin" activeId="advertise-tickets" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header with Slot Indicator */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-serif text-3xl font-medium tracking-tight text-white">
                                Advertise Tickets
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Toggle tickets to feature in the homepage Advertisement Section (max 6).
                            </p>
                        </div>

                        {/* Slot counter badge */}
                        <div className="inline-flex items-center gap-2 rounded-xl border border-hairline/10 bg-[var(--surface)] px-4 py-2 text-xs">
                            <Sparkles className="h-4 w-4 text-[var(--accent-ink)]" />
                            <span className="text-slate-400">Slots Used:</span>
                            <span className={`font-mono font-bold ${advertisedCount >= ADVERTISEMENT_LIMIT ? "text-amber-400" : "text-emerald-400"}`}>
                                {advertisedCount} / {ADVERTISEMENT_LIMIT}
                            </span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {isLoading ? (
                        <p className="mt-7 rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            Loading tickets…
                        </p>
                    ) : loadError ? (
                        <p role="alert" className="mt-7 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-10 text-center text-xs text-red-300">
                            {loadError}
                        </p>
                    ) : tickets.length === 0 ? (
                        <p className="mt-7 rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            No approved tickets are available to advertise yet.
                        </p>
                    ) : (
                    /* Table */
                    <div className="mt-7 overflow-x-auto rounded-xl border border-hairline/8 bg-[var(--surface)]">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-hairline/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">Ticket</th>
                                    <th className="px-4 py-3.5">Operator</th>
                                    <th className="px-4 py-3.5">Transport</th>
                                    <th className="px-4 py-3.5">Price</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/5 text-xs">
                                {tickets.map((t) => {
                                    const id = t._id || t.id;
                                    const isAdv = Boolean(t.isAdvertised);
                                    return (
                                        <tr key={id} className="transition-colors hover:bg-hairline/[0.02]">
                                            <td className="px-4 py-3.5 font-medium text-slate-200">
                                                {t.from} → {t.to}
                                                <span className="block text-[11px] font-normal text-slate-400">{t.title}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-300">
                                                {t.vendorName || "Operator"}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-400">
                                                {t.transportType || "Bus"}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono font-medium text-[var(--accent-ink)]">
                                                ৳{t.price}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {isAdv ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                                        <Check className="h-3 w-3" /> Advertised
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full border border-hairline/10 bg-hairline/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
                                                        Standard
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleAdvertise(id, isAdv)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                        isAdv
                                                            ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                            : "border border-brand/40 bg-brand/15 text-[var(--accent-ink)] hover:bg-brand/25"
                                                    }`}
                                                >
                                                    <Megaphone className="h-3.5 w-3.5" />
                                                    {isAdv ? "Unadvertise" : "Advertise"}
                                                </button>
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
