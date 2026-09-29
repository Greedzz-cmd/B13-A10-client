"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plane,
    TrainFront,
    BusFront,
    Ship,
    Clock,
    Calendar,
    Users,
    Check,
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    X,
    ShieldCheck,
    CreditCard
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api-client";

const transportIcons = {
    Flight: Plane,
    Train: TrainFront,
    Bus: BusFront,
    Launch: Ship,
};

function formatPrice(price) {
    return `৳${Number(price || 0).toLocaleString("en-IN")}`;
}

export default function TicketDetailsClient({ ticket }) {
    const router = useRouter();
    const session = useSession();
    const user = session?.data?.user;

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingQty, setBookingQty] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [countdown, setCountdown] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isPassed: false,
    });

    const departureDate = new Date(ticket.departureDateTime || Date.now() + 86400000);
    const arrivalDate = ticket.arrivalDateTime ? new Date(ticket.arrivalDateTime) : null;
    const TransportIcon = transportIcons[ticket.transportType] || BusFront;
    const totalSeats = Number(ticket.totalSeats || ticket.quantity || 40);
    const availableSeats = Number(ticket.quantity ?? 0);
    const isSoldOut = availableSeats <= 0;

    // Countdown logic
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = departureDate.getTime() - now;

            if (difference <= 0) {
                setCountdown({
                    days: "00",
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                    isPassed: true,
                });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setCountdown({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
                isPassed: false,
            });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [ticket.departureDateTime]);

    const handleOpenBooking = () => {
        if (!user) {
            router.push("/sign-in");
            return;
        }
        setIsBookingOpen(true);
        setBookingQty(1);
        setBookingError("");
        setBookingSuccess(false);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        const qty = Number(bookingQty);

        if (qty <= 0) {
            setBookingError("Please select at least 1 ticket.");
            return;
        }

        if (qty > availableSeats) {
            setBookingError(`Booking quantity cannot exceed available seats (${availableSeats}).`);
            return;
        }

        setIsSubmitting(true);
        setBookingError("");

        const payload = {
            ticketId: ticket._id || ticket.id,
            quantity: qty,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                throw new Error("Booking service is not configured.");
            }

            const res = await authenticatedFetch("/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to submit booking request.");
            }
            setBookingSuccess(true);
        } catch (err) {
            setBookingError(err.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--surface-canvas)] pb-24 pt-10 text-slate-100">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                {/* Back navigation link */}
                <Link
                    href="/tickets"
                    className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 transition hover:text-[var(--accent-ink)]"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to all tickets
                </Link>

                <div className="mt-6 grid gap-8 lg:grid-cols-3">
                    {/* Left 2 Columns: Main Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Hero Image Section */}
                        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-hairline/10 bg-slate-900 shadow-xl sm:h-[400px]">
                            {ticket.image ? (
                                <Image
                                    src={ticket.image}
                                    alt={ticket.title || "Ticket banner"}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <div className="grid h-full place-items-center bg-[var(--surface-inset)] text-slate-600">
                                    No Image Available
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-canvas)] via-black/30 to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute left-4 top-4 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/15 bg-shade/60 px-3 py-1 text-xs font-medium backdrop-blur-md">
                                    <TransportIcon className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                                    {ticket.transportType || "Bus"}
                                </span>
                                <span className="rounded-full border border-[#dd7845]/40 bg-[#dd7845]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-ink)] backdrop-blur-md">
                                    {ticket.fareClass || "Economy"}
                                </span>
                            </div>

                            {/* Bottom Title on Image */}
                            <div className="absolute bottom-5 left-5 right-5">
                                <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ink)]">
                                    {ticket.vendorName || "Verified Operator"}
                                </p>
                                <h1 className="mt-1 font-serif text-3xl font-medium text-white sm:text-4xl">
                                    {ticket.from} → {ticket.to}
                                </h1>
                                <p className="mt-1 text-sm text-slate-300">
                                    {ticket.title}
                                </p>
                            </div>
                        </div>

                        {/* Route Schedule & Timeline Card */}
                        <div className="rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-lg">
                            <h2 className="font-serif text-xl font-medium text-slate-100">Schedule & Route Details</h2>
                            <div className="mt-6 grid gap-6 sm:grid-cols-3">
                                <div>
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                        Departure
                                    </span>
                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-200">
                                        {departureDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {departureDate.toISOString().slice(0, 10)}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-300">
                                        {ticket.from}
                                    </p>
                                </div>

                                <div className="text-center sm:border-x sm:border-hairline/5 sm:px-4">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                        Duration
                                    </span>
                                    <div className="mt-2 flex items-center justify-center gap-2 text-xs font-mono text-[var(--accent-ink)]">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{ticket.duration || "Direct"}</span>
                                    </div>
                                    <div className="mt-2 h-0.5 w-full rounded-full bg-slate-800" />
                                </div>

                                <div className="text-right">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                        Arrival (Est.)
                                    </span>
                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-200">
                                        {arrivalDate
                                            ? arrivalDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                                            : "--:--"}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {arrivalDate ? arrivalDate.toISOString().slice(0, 10) : "Same day"}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-300">
                                        {ticket.to}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Perks & Amenities */}
                        <div className="rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-lg">
                            <h2 className="font-serif text-xl font-medium text-slate-100">Included Amenities & Perks</h2>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {ticket.perks && ticket.perks.length > 0 ? (
                                    ticket.perks.map((perk) => (
                                        <span
                                            key={perk}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline/10 bg-hairline/5 px-3 py-1.5 text-xs text-slate-200"
                                        >
                                            <Check className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                                            {perk}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">Standard seating and services included.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing, Countdown & Booking Action */}
                    <div className="space-y-6">
                        {/* Booking Summary Box */}
                        <div className="rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-xl">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                Fare per seat
                            </span>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="font-serif text-4xl font-bold text-white">
                                    {formatPrice(ticket.price)}
                                </span>
                                <span className="font-mono text-xs text-slate-400">BDT</span>
                            </div>

                            {/* Departure Countdown */}
                            <div className="mt-6 rounded-xl border border-hairline/10 bg-shade/30 p-4">
                                <span className="block text-center font-mono text-[10px] uppercase tracking-wider text-slate-400">
                                    {countdown.isPassed ? "DEPARTURE STATUS" : "DEPARTURE IN"}
                                </span>
                                {countdown.isPassed ? (
                                    <div className="mt-2 text-center text-xs font-semibold text-rose-400">
                                        Departure time has passed
                                    </div>
                                ) : (
                                    <div className="mt-3 grid grid-cols-4 gap-2 text-center font-mono">
                                        <div className="rounded-lg bg-hairline/5 p-2">
                                            <span className="block text-lg font-bold text-slate-100">{countdown.days}</span>
                                            <span className="text-[9px] text-slate-500">DAYS</span>
                                        </div>
                                        <div className="rounded-lg bg-hairline/5 p-2">
                                            <span className="block text-lg font-bold text-slate-100">{countdown.hours}</span>
                                            <span className="text-[9px] text-slate-500">HRS</span>
                                        </div>
                                        <div className="rounded-lg bg-hairline/5 p-2">
                                            <span className="block text-lg font-bold text-slate-100">{countdown.minutes}</span>
                                            <span className="text-[9px] text-slate-500">MIN</span>
                                        </div>
                                        <div className="rounded-lg bg-hairline/5 p-2">
                                            <span className="block text-lg font-bold text-[var(--accent-ink)]">{countdown.seconds}</span>
                                            <span className="text-[9px] text-slate-500">SEC</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Seats Inventory Progress */}
                            <div className="mt-6 border-t border-hairline/5 pt-4">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Available Seats</span>
                                    <span className="font-semibold text-slate-200">
                                        {availableSeats} / {totalSeats}
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-[#dd7845]"
                                        style={{
                                            width: `${Math.min(100, Math.max(0, ((totalSeats - availableSeats) / totalSeats) * 100))}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <button
                                type="button"
                                onClick={handleOpenBooking}
                                disabled={countdown.isPassed || isSoldOut}
                                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#dd7845] text-sm font-semibold text-white shadow-lg shadow-[#dd7845]/20 transition hover:bg-[#ee8954] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#dd7845]"
                            >
                                {countdown.isPassed ? "Departure Passed" : isSoldOut ? "Sold Out" : "Book Now"}
                            </button>

                            <p className="mt-3 text-center text-[11px] text-slate-500">
                                Instant confirmation request · Vendor approval required
                            </p>
                        </div>

                        {/* Safety & Guarantee info */}
                        <div className="rounded-2xl border border-hairline/5 bg-[var(--surface-inset)] p-5 text-xs text-slate-400 space-y-3">
                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>Verified transport operator on Routely.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CreditCard className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                                <span>Pay securely via Stripe upon vendor acceptance.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Now Modal */}
            {isBookingOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-shade/75 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-2xl text-slate-100">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setIsBookingOpen(false)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-hairline/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {bookingSuccess ? (
                            <div className="text-center py-4">
                                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                                    <CheckCircle2 className="h-7 w-7" />
                                </div>
                                <h3 className="font-serif text-xl font-medium text-white">Booking Submitted!</h3>
                                <p className="mt-2 text-xs text-slate-400">
                                    Your booking request for {bookingQty} seat(s) has been sent with <strong className="text-amber-400">Pending</strong> status.
                                </p>
                                <div className="mt-6 flex flex-col gap-2">
                                    <Link
                                        href="/dashboard/user-dashboard/bookings"
                                        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#dd7845] text-xs font-semibold text-white transition hover:bg-[#ee8954]"
                                    >
                                        Go to My Booked Tickets
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsBookingOpen(false)}
                                        className="h-10 text-xs text-slate-400 hover:text-slate-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitBooking}>
                                <h3 className="font-serif text-xl font-medium text-white">
                                    Confirm Ticket Reservation
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    {ticket.from} → {ticket.to} ({ticket.title})
                                </p>

                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                                            Passenger Name
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.name || "Passenger"}
                                            className="h-10 w-full rounded-lg border border-hairline/10 bg-hairline/5 px-3 text-xs text-slate-300 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                                            Ticket Quantity (Max: {availableSeats})
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={availableSeats}
                                            value={bookingQty}
                                            onChange={(e) => setBookingQty(Number(e.target.value))}
                                            required
                                            className="h-10 w-full rounded-lg border border-hairline/10 bg-[var(--surface)] px-3 text-sm text-white outline-none focus:border-[#dd7845]"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-hairline/5 bg-shade/30 p-3.5 text-xs space-y-2">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Unit Price:</span>
                                            <span>{formatPrice(ticket.price)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Quantity:</span>
                                            <span>{bookingQty}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-hairline/5 pt-2 text-sm font-semibold">
                                            <span className="text-slate-200">Total Price:</span>
                                            <span className="text-[var(--accent-ink)]">{formatPrice(Number(ticket.price) * Number(bookingQty))}</span>
                                        </div>
                                    </div>

                                    {bookingError && (
                                        <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                                            <span>{bookingError}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsBookingOpen(false)}
                                        className="flex-1 rounded-xl border border-hairline/10 bg-hairline/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-hairline/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-xl bg-[#dd7845] py-2.5 text-xs font-semibold text-white hover:bg-[#ee8954] disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Booking"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
