import { BusFront, Check, Plane, Ship, TrainFront } from "lucide-react";
import Link from "next/link";
import TicketImage from "./TicketImage";

function formatPrice(price) {
    // Format ticket prices with the Bangladeshi taka currency symbol.
    return `৳${Number(price).toLocaleString("en-IN")}`;
}

function formatDeparture(dateTimeStr) {
    // Format timestamp to "HH:mm · YYYY-MM-DD" as shown in the card design.
    try {
        const date = new Date(dateTimeStr);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${hours}:${minutes} · ${year}-${month}-${day}`;
    } catch {
        return "22:00 · 2026-09-20";
    }
}

function getTransportIcon(type, className = "h-3.5 w-3.5") {
    switch (type) {
        case "Flight":
            return <Plane aria-hidden="true" className={className} />;
        case "Train":
            return <TrainFront aria-hidden="true" className={className} />;
        case "Launch":
            return <Ship aria-hidden="true" className={className} />;
        case "Bus":
        default:
            return <BusFront aria-hidden="true" className={className} />;
    }
}

export function getFareClass(ticket) {
    if (ticket.fareClass) return ticket.fareClass;
    const perkCount = ticket.perks?.length || 0;
    if (ticket.price >= 3000 || perkCount >= 4) return "Business";
    if (ticket.transportType !== "Bus" && ticket.price <= 700) return "First";
    return "Economy";
}

export default function TicketCard({ ticket, viewMode = "grid" }) {


    const fareClass = getFareClass(ticket);
    const totalSeats = ticket.totalSeats || 44;
    const seatsLeft = ticket.quantity ?? 6;
    const bookedCount = Math.max(0, totalSeats - seatsLeft);
    const bookedPercent = Math.min(100, Math.max(0, Math.round((bookedCount / totalSeats) * 100)));

    const perks = ticket.perks || ["AC", "WiFi", "USB Charging"];
    const displayedPerks = perks.slice(0, 3);
    const remainingPerks = perks.length - displayedPerks.length;

    // List view adaptation for desktop screens
    if (viewMode === "list") {
        return (
            <article className="group relative overflow-hidden rounded-2xl border border-[#1e2a3c] bg-[#111a28] shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#dd7845]/50 hover:bg-[#131d2e] md:grid md:grid-cols-[260px_1fr]">
                {/* Image section */}
                <div className="relative h-[200px] w-full overflow-hidden bg-slate-900 md:h-full">
                    <TicketImage
                        alt={`${ticket.from} to ${ticket.to}`}
                        src={ticket.image}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111a28] via-transparent to-black/40" />

                    {/* Top-left badges */}
                    <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0d1624]/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                            {getTransportIcon(ticket.transportType, "h-3 w-3")}
                            <span>{ticket.transportType}</span>
                        </span>
                        {ticket.featured && (
                            <span className="inline-flex items-center rounded-full bg-[#dd7845] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                FEATURED
                            </span>
                        )}
                    </div>

                    {/* Top-right badge */}
                    <div className="absolute right-3.5 top-3.5">
                        <span className="inline-flex items-center rounded-full border border-white/5 bg-[#0d1624]/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#dd7845] backdrop-blur-md">
                            {fareClass}
                        </span>
                    </div>

                    {/* Bottom-right price on image */}
                    <div className="absolute bottom-2.5 right-3.5 text-right">
                        <span className="block font-serif text-[24px] font-normal leading-none text-white drop-shadow-md">
                            {formatPrice(ticket.price)}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] tracking-tight text-slate-300 drop-shadow">
                            per seat
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between p-5 sm:p-6">
                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <h2 className="font-serif text-[22px] font-normal leading-tight text-slate-100">
                                    {ticket.from} → {ticket.to}
                                </h2>
                                <p className="mt-0.5 text-[13px] text-slate-400">{ticket.vendorName}</p>
                            </div>
                        </div>

                        {/* 4-column spec row for wide view */}
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                                <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                    PRICE / SEAT
                                </span>
                                <span className="mt-1 block text-[15px] font-bold text-[#dd7845]">
                                    {formatPrice(ticket.price)}
                                </span>
                            </div>
                            <div>
                                <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                    TRANSPORT
                                </span>
                                <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-200">
                                    {getTransportIcon(ticket.transportType)}
                                    <span>{ticket.transportType}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                    DEPARTURE
                                </span>
                                <span className="mt-1 block font-mono text-[13px] text-slate-200">
                                    {formatDeparture(ticket.departureDateTime)}
                                </span>
                            </div>
                            <div>
                                <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                    DURATION
                                </span>
                                <span className="mt-1 block font-mono text-[13px] text-slate-200">
                                    {ticket.duration || "6h 40m"}
                                </span>
                            </div>
                        </div>

                        {/* Seat Availability & Progress Bar */}
                        <div className="mt-5">
                            <div className="flex items-center justify-between font-mono text-[11px]">
                                <span className="text-slate-400">
                                    <b className="font-bold text-slate-100">{seatsLeft}</b> seats left of {totalSeats}
                                </span>
                                <span className="font-medium text-[#dd7845]">{bookedPercent}% booked</span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1b2536]">
                                <div
                                    className="h-full rounded-full bg-[#dd7845] transition-all duration-500"
                                    style={{ width: `${bookedPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Perks and Footer row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {displayedPerks.map(perk => (
                                <span
                                    key={perk}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#213045] bg-[#162132] px-2.5 py-1 text-[11px] text-slate-300"
                                >
                                    <Check aria-hidden="true" className="h-3 w-3 text-[#dd7845]" />
                                    <span>{perk}</span>
                                </span>
                            ))}
                            {remainingPerks > 0 && (
                                <span className="ml-0.5 text-[11px] font-medium text-slate-500">
                                    +{remainingPerks} more
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1 text-[13px]">
                                <span className="text-sm text-amber-400">★</span>
                                <span className="font-bold text-slate-200">{ticket.rating || "4.3"}</span>
                                <span className="font-normal text-slate-500">({ticket.reviewsCount || 567})</span>
                            </div>

                            <Link
                                className="group/link inline-flex items-center gap-1 text-[13px] font-medium text-[#dd7845] transition-colors hover:text-[#ef8a53]"
                                href={`/tickets/${ticket._id}`}
                            >
                                <span>See details</span>
                                <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Default Grid view matching user's design reference exactly
    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1e2a3c] bg-[#111a28] shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#dd7845]/50 hover:bg-[#131d2e]">
            {/* Top Image Section with Badges and Price Overlay */}
            <div className="relative h-[190px] w-full overflow-hidden bg-slate-900">
                <TicketImage
                    alt={`${ticket.from} to ${ticket.to}`}
                    src={ticket.image}
                />
                {/* Vignette and bottom gradient for clean contrast */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111a28] via-transparent to-black/40" />

                {/* Top-left badges: Transport mode + Featured */}
                <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0d1624]/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                        {getTransportIcon(ticket.transportType, "h-3 w-3")}
                        <span>{ticket.transportType}</span>
                    </span>
                    {ticket.featured && (
                        <span className="inline-flex items-center rounded-full bg-[#dd7845] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                            FEATURED
                        </span>
                    )}
                </div>

                {/* Top-right badge: Fare class */}
                <div className="absolute right-3.5 top-3.5">
                    <span className="inline-flex items-center rounded-full border border-white/5 bg-[#0d1624]/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#dd7845] backdrop-blur-md">
                        {fareClass}
                    </span>
                </div>

                {/* Bottom-right price overlay */}
                <div className="absolute bottom-2.5 right-3.5 text-right">
                    <span className="block font-serif text-[26px] font-normal leading-none text-white drop-shadow-md">
                        {formatPrice(ticket.price)}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-tight text-slate-300 drop-shadow">
                        per seat
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    {/* Route Title */}
                    <h2 className="font-serif text-[22px] font-normal leading-tight text-slate-100">
                        {ticket.from} → {ticket.to}
                    </h2>

                    {/* Operator Name */}
                    <p className="mt-1 text-[13px] text-slate-400">{ticket.vendorName}</p>

                    {/* 2x2 Spec Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5">
                        {/* Cell 1: Price */}
                        <div>
                            <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                PRICE / SEAT
                            </span>
                            <span className="mt-1 block text-[15px] font-bold text-[#dd7845]">
                                {formatPrice(ticket.price)}
                            </span>
                        </div>

                        {/* Cell 2: Transport */}
                        <div>
                            <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                TRANSPORT
                            </span>
                            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-200">
                                {getTransportIcon(ticket.transportType)}
                                <span>{ticket.transportType}</span>
                            </div>
                        </div>

                        {/* Cell 3: Departure */}
                        <div>
                            <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                DEPARTURE
                            </span>
                            <span className="mt-1 block font-mono text-[13px] text-slate-200">
                                {formatDeparture(ticket.departureDateTime)}
                            </span>
                        </div>

                        {/* Cell 4: Duration */}
                        <div>
                            <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                DURATION
                            </span>
                            <span className="mt-1 block font-mono text-[13px] text-slate-200">
                                {ticket.duration || "9h 00m"}
                            </span>
                        </div>
                    </div>

                    {/* Seat Availability & Progress Bar */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-slate-400">
                                <b className="font-bold text-slate-100">{seatsLeft}</b> seats left of {totalSeats}
                            </span>
                            <span className="font-medium text-[#dd7845]">{bookedPercent}% booked</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1b2536]">
                            <div
                                className="h-full rounded-full bg-[#dd7845] transition-all duration-500"
                                style={{ width: `${bookedPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Amenities / Perks Pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {displayedPerks.map(perk => (
                            <span
                                key={perk}
                                className="inline-flex items-center gap-1 rounded-full border border-[#213045] bg-[#162132] px-2.5 py-1 text-[11px] text-slate-300"
                            >
                                <Check aria-hidden="true" className="h-3 w-3 text-[#dd7845]" />
                                <span>{perk}</span>
                            </span>
                        ))}
                        {remainingPerks > 0 && (
                            <span className="ml-0.5 text-[11px] font-medium text-slate-500">
                                +{remainingPerks} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Row: Rating & See Details */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-1 text-[13px]">
                        <span className="text-sm text-amber-400">★</span>
                        <span className="font-bold text-slate-200">{ticket.rating || "4.3"}</span>
                        <span className="font-normal text-slate-500">({ticket.reviewsCount || 567})</span>
                    </div>

                    <Link
                        className="group/link inline-flex items-center gap-1 text-[13px] font-medium text-[#dd7845] transition-colors hover:text-[#ef8a53]"
                        href={`/tickets/${ticket._id}`}
                    >
                        <span>See details</span>
                        <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}
