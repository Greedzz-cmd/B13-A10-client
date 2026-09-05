"use client";

import React, { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";

const BOOKED_TICKETS = [
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
        departs: "08:00 · 2026-09-05",
        status: "accepted",
        notice: {
            type: "expired",
            title: "Departure passed",
            subtitle: "Payment window closed — departure passed.",
        },
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
        departs: "06:40 · 2026-09-10",
        status: "paid",
        notice: {
            type: "countdown",
            label: "DEPARTS IN",
            time: "04d 08h 42m 56s",
        },
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
        departs: "22:00 · 2026-09-20",
        status: "pending",
        notice: {
            type: "countdown",
            label: "DEPARTS IN",
            time: "15d 00h 02m 56s",
        },
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
        departs: "18:00 · 2026-10-10",
        status: "rejected",
        notice: null,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=900&auto=format&fit=crop",
    },
];

const TYPE_ICONS = {
    Flight: Plane,
    Train: TrainFront,
    Bus: BusFront,
    Launch: Ship,
};

const STATUS_CONFIG = {
    accepted: {
        label: "accepted",
        badge: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
        icon: CheckCircle2,
    },
    paid: {
        label: "paid",
        badge: "border-blue-500/40 text-blue-400 bg-blue-950/40",
        icon: CheckCircle2,
    },
    pending: {
        label: "pending",
        badge: "border-amber-500/40 text-amber-400 bg-amber-950/40",
        icon: AlertCircle,
    },
    rejected: {
        label: "rejected",
        badge: "border-rose-500/40 text-rose-400 bg-rose-950/40",
        icon: XCircle,
    },
};

export default function BookedTicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState(null);

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-7">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                    My Booked Tickets
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                    {BOOKED_TICKETS.length} bookings total
                </p>
            </div>

            {/* Grid of Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOOKED_TICKETS.map((ticket) => {
                    const TypeIcon = TYPE_ICONS[ticket.type] || Plane;
                    const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;

                    return (
                        <div
                            key={ticket.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e172a] shadow-lg transition-all duration-300 hover:border-white/20"
                        >
                            {/* Media Header */}
                            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                                <Image
                                    src={ticket.image}
                                    alt={`${ticket.from} to ${ticket.to}`}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0e172a] via-black/20 to-transparent" />

                                {/* Top Badges */}
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                    {/* Transport Type */}
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                                        <TypeIcon className="h-3 w-3" />
                                        <span>{ticket.type}</span>
                                    </span>

                                    {/* Status Badge */}
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize backdrop-blur-md ${statusInfo.badge}`}
                                    >
                                        <statusInfo.icon className="h-3 w-3" />
                                        <span>{statusInfo.label}</span>
                                    </span>
                                </div>

                                {/* Price overlay */}
                                <div className="absolute bottom-2.5 right-3 text-right">
                                    <div className="font-serif text-lg font-bold text-white drop-shadow">
                                        ৳{ticket.totalPrice.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-slate-300 uppercase tracking-wider">
                                        total
                                    </div>
                                </div>
                            </div>

                            {/* Card Content Body */}
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div className="space-y-3">
                                    {/* Route & Operator */}
                                    <div>
                                        <h3 className="font-semibold text-slate-100 text-[15px]">
                                            {ticket.from} → {ticket.to}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {ticket.operator}
                                        </p>
                                    </div>

                                    {/* Seats and Fare Info */}
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Qty: <strong className="text-slate-200">{ticket.quantity} {ticket.quantity > 1 ? "seats" : "seat"}</strong></span>
                                        <span>Price: <strong className="text-[#dd7845]">৳{ticket.pricePerSeat.toLocaleString()}/seat</strong></span>
                                    </div>

                                    {/* Departs & PNR */}
                                    <div className="border-t border-white/5 pt-2.5 space-y-1 text-xs">
                                        <div className="text-slate-400">
                                            Departs: <span className="text-slate-300 font-medium">{ticket.departs}</span>
                                        </div>
                                        <div className="text-slate-400 font-mono text-[11px]">
                                            PNR: <span className="text-slate-200">{ticket.pnr}</span>
                                        </div>
                                    </div>

                                    {/* Optional Notice / Countdown */}
                                    {ticket.notice && (
                                        ticket.notice.type === "expired" ? (
                                            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2.5 text-center">
                                                <p className="text-xs font-semibold text-rose-400">
                                                    {ticket.notice.title}
                                                </p>
                                                <p className="text-[10.5px] text-rose-300/80 mt-0.5">
                                                    {ticket.notice.subtitle}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-3 py-2 text-xs">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    {ticket.notice.label}
                                                </span>
                                                <span className="font-mono text-xs font-medium text-slate-200">
                                                    {ticket.notice.time}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* View Ticket Button */}
                                <div className="mt-5 border-t border-white/5 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.99]"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>View ticket</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedTicket(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] p-6 shadow-2xl text-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            aria-label="Close dialog"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dd7845]/15 text-[#dd7845]">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold">
                                    Booking Pass — {selectedTicket.pnr}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {selectedTicket.operator} · {selectedTicket.type}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-3 text-xs mb-5">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Route</span>
                                <span className="font-semibold text-slate-200">{selectedTicket.from} → {selectedTicket.to}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Departure</span>
                                <span className="text-slate-200">{selectedTicket.departs}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Seats Reserved</span>
                                <span className="text-slate-200">{selectedTicket.quantity} Passenger(s)</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Status</span>
                                <span className="capitalize font-semibold text-slate-200">{selectedTicket.status}</span>
                            </div>
                            <div className="flex justify-between pt-1 text-sm font-semibold">
                                <span className="text-slate-300">Total Paid</span>
                                <span className="text-[#dd7845]">৳{selectedTicket.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedTicket(null)}
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors text-slate-300"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex-1 rounded-xl bg-[#dd7845] py-2.5 text-xs font-medium text-white hover:bg-[#ee8954] transition-colors"
                            >
                                Print Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
