"use client";

import { BusFront, CalendarDays, Plane, Ship, TrainFront, Users, X, Pencil } from "lucide-react";
import TicketImage from "./TicketImage";

const transportIcons = {
    Bus: BusFront,
    Flight: Plane,
    Launch: Ship,
    Train: TrainFront,
};

const statusStyles = {
    approved: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-amber-500/15 text-amber-400",
    rejected: "bg-red-500/15 text-red-400",
};

function formatPrice(price) {
    return `৳${Number(price || 0).toLocaleString("en-IN")}`;
}

function formatDate(dateTime) {
    if (!dateTime) return "Date not set";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return dateTime;
    return date.toISOString().slice(0, 10);
}

function formatTime(dateTime) {
    if (!dateTime) return "--:--";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function VendorTicketCard({ ticket, onDelete, onEdit, isDeleting = false, deleteError = "" }) {
    const TransportIcon = transportIcons[ticket.transportType] || BusFront;
    const status = (ticket.verificationStatus || "pending").toLowerCase();
    const totalSeats = Number(ticket.totalSeats || ticket.quantity || 0);
    const seatsLeft = Number(ticket.quantity ?? totalSeats);
    const isSoldOut = seatsLeft <= 0;

    return (
        <article className="overflow-hidden rounded-xl border border-[#25324a] bg-[#111b2d] shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-colors hover:border-blue-500/40">
            <div className="relative h-28 overflow-hidden bg-[#0d1626]">
                <TicketImage alt={`${ticket.from} to ${ticket.to}`} src={ticket.image} />
                <div className="absolute inset-0 bg-linear-to-t from-[#111b2d] via-transparent to-black/30" />
                <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#0b1422]/80 px-2 py-1 text-[9px] text-slate-200 backdrop-blur-sm">
                    <TransportIcon aria-hidden="true" className="h-2.5 w-2.5" />
                    {ticket.transportType || "Bus"}
                </div>
                <span className={`absolute right-2.5 top-2.5 rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-wide ${statusStyles[status] || statusStyles.pending}`}>
                    {status}
                </span>
                <div className="absolute bottom-2 right-2.5 text-right">
                    <p className="font-serif text-lg leading-none text-white">{formatPrice(ticket.price)}</p>
                    <p className="mt-0.5 font-mono text-[8px] text-slate-300">per seat · {ticket.fareClass || "Economy"}</p>
                </div>
            </div>

            <div className="p-2.5">
                <h2 className="font-serif text-sm text-slate-100">{ticket.from} → {ticket.to}</h2>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">{ticket.title || ticket.vendorName || "Routely service"}</p>

                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                    <div>
                        <p className="font-mono text-[11px] font-semibold text-slate-200">{formatTime(ticket.departureDateTime)}</p>
                        <p className="text-[8px] uppercase text-slate-500">{ticket.from}</p>
                    </div>
                    <div className="min-w-12">
                        <div className="h-px bg-[#28364d]" />
                        <p className="mt-1 font-mono text-[8px] text-slate-500">{ticket.duration || "Direct"}</p>
                    </div>
                    <div>
                        <p className="font-mono text-[11px] font-semibold text-slate-200">{formatTime(ticket.arrivalDateTime)}</p>
                        <p className="text-[8px] uppercase text-slate-500">{ticket.to}</p>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 font-mono text-[8px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-2.5 w-2.5" />{formatDate(ticket.departureDateTime)}</span>
                    <span className={isSoldOut ? "text-red-400" : "inline-flex items-center gap-1 text-slate-400"}>
                        {!isSoldOut && <Users className="h-2.5 w-2.5" />}
                        {isSoldOut ? "Sold out" : `${seatsLeft} / ${totalSeats} seats`}
                    </span>
                </div>

                <div className="mt-2 flex gap-1.5 border-t border-white/5 pt-2">
                    <button
                        type="button"
                        onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            onEdit?.(ticket);
                        }}
                        className="inline-flex h-6 flex-1 items-center justify-center gap-1 rounded-md border border-[#26354c] text-[9px] text-slate-300 transition hover:border-blue-500/50 hover:text-blue-300"
                    >
                        <Pencil className="h-2.5 w-2.5" /> Update
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(ticket._id || ticket.id)}
                        disabled={isDeleting}
                        aria-label={`Delete ticket from ${ticket.from} to ${ticket.to}`}
                        className="inline-flex h-6 flex-1 items-center justify-center gap-1 rounded-md border border-red-500/20 text-[9px] text-red-400 transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-50"
                    >
                        <X className="h-2.5 w-2.5" /> {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
                {deleteError && <p role="alert" className="mt-2 text-[10px] text-red-400">{deleteError}</p>}
            </div>
        </article>
    );
}
