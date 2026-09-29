"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Plane,
    TrainFront,
    BusFront,
    Ship,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    X,
    QrCode,
    CreditCard,
    RefreshCw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const FALLBACK_BOOKINGS = [
    {
        id: "TKB-2K8X4N",
        pnr: "TKB-2K8X4N",
        type: "Flight",
        from: "Dhaka",
        to: "Chittagong",
        operator: "Biman Bangladesh Airlines",
        quantity: 2,
        pricePerSeat: 4800,
        totalPrice: 9600,
        departureDateTime: "2026-09-05T08:00:00",
        departs: "08:00 · 2026-09-05",
        status: "accepted",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "TKB-7M3P9Q",
        pnr: "TKB-7M3P9Q",
        type: "Train",
        from: "Dhaka",
        to: "Sylhet",
        operator: "Parabat Express",
        quantity: 1,
        pricePerSeat: 850,
        totalPrice: 850,
        departureDateTime: "2026-10-10T06:40:00",
        departs: "06:40 · 2026-10-10",
        status: "paid",
        image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "TKB-4R6T2W",
        pnr: "TKB-4R6T2W",
        type: "Bus",
        from: "Dhaka",
        to: "Cox's Bazar",
        operator: "Shyamoli Paribahan",
        quantity: 3,
        pricePerSeat: 1100,
        totalPrice: 3300,
        departureDateTime: "2026-12-20T22:00:00",
        departs: "22:00 · 2026-12-20",
        status: "pending",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "TKB-9K1Y5H",
        pnr: "TKB-9K1Y5H",
        type: "Launch",
        from: "Dhaka",
        to: "Khulna",
        operator: "MV Sundarban",
        quantity: 2,
        pricePerSeat: 1500,
        totalPrice: 3000,
        departureDateTime: "2026-11-10T18:00:00",
        departs: "18:00 · 2026-11-10",
        status: "rejected",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=900&auto=format&fit=crop",
    },
];

const TYPE_ICONS = { Flight: Plane, Train: TrainFront, Bus: BusFront, Launch: Ship };

const STATUS_CONFIG = {
    accepted: { label: "accepted", badge: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40", icon: CheckCircle2 },
    paid:     { label: "paid",     badge: "border-blue-500/40 text-blue-400 bg-blue-950/40",       icon: CheckCircle2 },
    pending:  { label: "pending",  badge: "border-amber-500/40 text-amber-400 bg-amber-950/40",    icon: AlertCircle },
    rejected: { label: "rejected", badge: "border-rose-500/40 text-rose-400 bg-rose-950/40",       icon: XCircle },
};

function normalizeBooking(b) {
    const departure = b.departureDateTime || b.departs || "";
    let departsFormatted = b.departs || "";
    if (!departsFormatted && departure) {
        try {
            const d = new Date(departure);
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            const yy = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            departsFormatted = `${hh}:${mm} · ${yy}-${mo}-${dd}`;
        } catch { departsFormatted = departure; }
    }
    return {
        id: b._id || b.id,
        pnr: b.pnr || b._id || b.id,
        type: b.transportType || b.type || "Bus",
        from: b.from,
        to: b.to,
        operator: b.operator || b.vendorName || b.ticketTitle || "Operator",
        quantity: b.quantity ?? 1,
        pricePerSeat: b.pricePerSeat ?? b.price ?? 0,
        totalPrice: b.totalPrice ?? ((b.quantity ?? 1) * (b.pricePerSeat ?? b.price ?? 0)),
        departureDateTime: departure,
        departs: departsFormatted,
        status: (b.status || "pending").toLowerCase(),
        image: b.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    };
}

function useCountdown(dateTimeStr) {
    const [display, setDisplay] = useState(null);
    useEffect(() => {
        if (!dateTimeStr) return;
        const target = new Date(dateTimeStr).getTime();
        const update = () => {
            const diff = target - Date.now();
            if (diff <= 0) { setDisplay(null); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setDisplay(
                `${String(d).padStart(2, "0")}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
            );
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [dateTimeStr]);
    return display;
}

function BookingCard({ ticket, onView }) {
    const countdown = useCountdown(ticket.departureDateTime);
    const hasDeparted = !countdown && !!ticket.departureDateTime;
    const TypeIcon = TYPE_ICONS[ticket.type] || BusFront;
    const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
    const canPay = ticket.status === "accepted" && !hasDeparted;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] shadow-lg transition-all duration-300 hover:border-hairline/20">
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <Image src={ticket.image} alt={`${ticket.from} to ${ticket.to}`} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-inset)] via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/15 bg-shade/50 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                        <TypeIcon className="h-3 w-3" /><span>{ticket.type}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize backdrop-blur-md ${statusInfo.badge}`}>
                        <statusInfo.icon className="h-3 w-3" /><span>{statusInfo.label}</span>
                    </span>
                </div>
                <div className="absolute bottom-2.5 right-3 text-right">
                    <div className="font-serif text-lg font-bold text-white drop-shadow">৳{ticket.totalPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider">total</div>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-slate-100 text-[15px]">{ticket.from} → {ticket.to}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{ticket.operator}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Qty: <strong className="text-slate-200">{ticket.quantity} {ticket.quantity > 1 ? "seats" : "seat"}</strong></span>
                        <span>Price: <strong className="text-[var(--accent-ink)]">৳{ticket.pricePerSeat.toLocaleString()}/seat</strong></span>
                    </div>
                    <div className="border-t border-hairline/5 pt-2.5 space-y-1 text-xs">
                        <div className="text-slate-400">Departs: <span className="text-slate-300 font-medium">{ticket.departs}</span></div>
                        <div className="text-slate-400 font-mono text-[11px]">PNR: <span className="text-slate-200">{ticket.pnr}</span></div>
                    </div>
                    {ticket.status !== "rejected" && (
                        hasDeparted ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2.5 text-center">
                                <p className="text-xs font-semibold text-rose-400">Departure passed</p>
                                <p className="text-[10.5px] text-rose-300/80 mt-0.5">Payment window closed.</p>
                            </div>
                        ) : countdown ? (
                            <div className="flex items-center justify-between rounded-xl border border-hairline/5 bg-shade/40 px-3 py-2 text-xs">
                                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    <Clock className="h-3 w-3" /> Departs In
                                </span>
                                <span className="font-mono text-xs font-medium text-slate-200">{countdown}</span>
                            </div>
                        ) : null
                    )}
                </div>

                <div className="mt-5 border-t border-hairline/5 pt-3 flex flex-col gap-2">
                    {canPay && (
                        <Link href="/dashboard/user-dashboard/transactions"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.99]">
                            <CreditCard className="h-3.5 w-3.5" /><span>Pay Now</span>
                        </Link>
                    )}
                    <button type="button" onClick={() => onView(ticket)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline/10 bg-hairline/5 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-hairline/10 hover:border-hairline/20 active:scale-[0.99]">
                        <Eye className="h-3.5 w-3.5" /><span>View ticket</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BookedTicketsPage() {
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const [bookings, setBookings] = useState(FALLBACK_BOOKINGS);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        if (!userEmail) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;
        setLoading(true);
        fetch(`${apiUrl}/bookings?userEmail=${encodeURIComponent(userEmail)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (Array.isArray(data) && data.length > 0) setBookings(data.map(normalizeBooking)); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [userEmail]);

    return (
        <div className="max-w-6xl">
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">My Booked Tickets</h1>
                    <p className="mt-1 text-xs text-slate-400">
                        {loading ? "Loading…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                {loading && <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((ticket) => (
                    <BookingCard key={ticket.id} ticket={ticket} onView={setSelectedTicket} />
                ))}
            </div>

            {!loading && bookings.length === 0 && (
                <div className="mt-16 rounded-2xl border border-dashed border-hairline/10 p-12 text-center">
                    <p className="text-base font-medium text-slate-300">No bookings yet</p>
                    <p className="mt-1 text-xs text-slate-500">Browse available tickets and place your first booking request.</p>
                    <Link href="/tickets" className="mt-4 inline-flex rounded-lg bg-[#dd7845] px-4 py-2 text-xs font-medium text-white hover:bg-[#ef8a53]">
                        Browse Tickets
                    </Link>
                </div>
            )}

            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-shade/70 backdrop-blur-sm"
                    role="dialog" aria-modal="true" onClick={() => setSelectedTicket(null)}>
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-2xl text-slate-100"
                        onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-hairline/10 hover:text-white" aria-label="Close dialog">
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dd7845]/15 text-[var(--accent-ink)]">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold">Booking Pass — {selectedTicket.pnr}</h2>
                                <p className="text-xs text-slate-400">{selectedTicket.operator} · {selectedTicket.type}</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-hairline/5 bg-shade/30 p-4 space-y-3 text-xs mb-5">
                            {[
                                ["Route", `${selectedTicket.from} → ${selectedTicket.to}`],
                                ["Departure", selectedTicket.departs],
                                ["Seats Reserved", `${selectedTicket.quantity} Passenger(s)`],
                                ["Status", selectedTicket.status],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between border-b border-hairline/5 pb-2">
                                    <span className="text-slate-400">{label}</span>
                                    <span className="font-semibold capitalize text-slate-200">{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pt-1 text-sm font-semibold">
                                <span className="text-slate-300">Total</span>
                                <span className="text-[var(--accent-ink)]">৳{selectedTicket.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setSelectedTicket(null)}
                                className="flex-1 rounded-xl border border-hairline/10 bg-hairline/5 py-2.5 text-xs font-medium hover:bg-hairline/10 transition-colors text-slate-300">
                                Close
                            </button>
                            <button type="button" onClick={() => window.print()}
                                className="flex-1 rounded-xl bg-[#dd7845] py-2.5 text-xs font-medium text-white hover:bg-[#ee8954] transition-colors">
                                Print Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
