"use client";

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
    Loader2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api-client";

const TYPE_ICONS = { Flight: Plane, Train: TrainFront, Bus: BusFront, Launch: Ship };

const STATUS_CONFIG = {
    accepted: { label: "accepted", badge: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40", icon: CheckCircle2 },
    paid:     { label: "paid",     badge: "border-blue-500/40 text-blue-400 bg-blue-950/40",       icon: CheckCircle2 },
    pending:  { label: "pending",  badge: "border-amber-500/40 text-amber-400 bg-amber-950/40",    icon: AlertCircle },
    rejected: { label: "rejected", badge: "border-rose-500/40 text-rose-400 bg-rose-950/40",       icon: XCircle },
    cancelled: { label: "cancelled", badge: "border-slate-500/40 text-slate-400 bg-slate-800/40",   icon: XCircle },
};

const formatDeparture = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const mo = String(date.getMonth() + 1).padStart(2, "0");
    const yy = date.getFullYear();

    return `${hh}:${mm} · ${yy}-${mo}-${dd}`;
};

/** Flattens a booking plus its ticket into the shape the card renders. */
function normalizeBooking(booking) {
    const ticket = booking.ticket || {};
    const quantity = booking.quantity ?? 1;
    const pricePerSeat = booking.pricePerSeat ?? booking.price ?? 0;

    return {
        id: booking._id || booking.id,
        pnr: booking.pnr || booking._id || booking.id,
        type: booking.transportType || ticket.transportType || "Bus",
        from: booking.from || ticket.from || "",
        to: booking.to || ticket.to || "",
        operator: booking.operator || booking.vendorName || ticket.operator || "Operator",
        quantity,
        pricePerSeat,
        totalPrice: booking.totalPrice ?? quantity * pricePerSeat,
        departureDateTime: booking.departureDateTime || ticket.departureDateTime || "",
        departs: formatDeparture(booking.departureDateTime || ticket.departureDateTime),
        status: (booking.status || "pending").toLowerCase(),
        image:
            ticket.image ||
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    };
}

function useCountdown(dateTimeStr) {
    const [display, setDisplay] = useState(null);

    useEffect(() => {
        if (!dateTimeStr) return undefined;

        const target = new Date(dateTimeStr).getTime();
        const update = () => {
            const diff = target - Date.now();

            if (diff <= 0) {
                setDisplay(null);
                return;
            }

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

function BookingCard({ ticket, onView, onPay, payingId, payError }) {
    const countdown = useCountdown(ticket.departureDateTime);
    const hasDeparted = !countdown && Boolean(ticket.departureDateTime);
    const TypeIcon = TYPE_ICONS[ticket.type] || BusFront;
    const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
    const canPay = ticket.status === "accepted" && !hasDeparted;
    const isPaying = payingId === ticket.id;
    const showPayError = payError?.bookingId === ticket.id;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] shadow-lg transition-all duration-300 hover:border-hairline/20">
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <Image
                    src={ticket.image}
                    alt={`${ticket.from} to ${ticket.to}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-inset)] via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/15 bg-shade/50 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                        <TypeIcon className="h-3 w-3" />
                        <span>{ticket.type}</span>
                    </span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize backdrop-blur-md ${statusInfo.badge}`}
                    >
                        <statusInfo.icon className="h-3 w-3" />
                        <span>{statusInfo.label}</span>
                    </span>
                </div>
                <div className="absolute bottom-2.5 right-3 text-right">
                    <div className="font-serif text-lg font-bold text-white drop-shadow">
                        ৳{ticket.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider">total</div>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-slate-100 text-[15px]">
                            {ticket.from} → {ticket.to}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{ticket.operator}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                            Qty: <strong className="text-slate-200">{ticket.quantity} {ticket.quantity > 1 ? "seats" : "seat"}</strong>
                        </span>
                        <span>
                            Price:{" "}
                            <strong className="text-[var(--accent-ink)]">৳{ticket.pricePerSeat.toLocaleString()}/seat</strong>
                        </span>
                    </div>
                    <div className="border-t border-hairline/5 pt-2.5 space-y-1 text-xs">
                        <div className="text-slate-400">
                            Departs: <span className="text-slate-300 font-medium">{ticket.departs}</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                            PNR: <span className="text-slate-200">{ticket.pnr}</span>
                        </div>
                    </div>

                    {showPayError && (
                        <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-950/25 p-2.5 text-[11px] text-rose-300">
                            {payError.message}
                        </p>
                    )}

                    {ticket.status !== "rejected" && ticket.status !== "cancelled" && (
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
                        <button
                            type="button"
                            onClick={() => onPay(ticket)}
                            disabled={isPaying}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPaying ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Starting checkout</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-3.5 w-3.5" />
                                    <span>Pay Now</span>
                                </>
                            )}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onView(ticket)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline/10 bg-hairline/5 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-hairline/10 hover:border-hairline/20 active:scale-[0.99]"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View ticket</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BookedTicketsPage() {
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const isSessionPending = session?.isPending ?? true;
    const [bookings, setBookings] = useState(null);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [payingId, setPayingId] = useState(null);
    const [payError, setPayError] = useState(null);

    /**
     * Fetches and normalises the signed-in user's bookings. Returns the data
     * instead of writing state, so both the initial load and the refresh after
     * a payment can drive it without duplicating the request logic.
     */
    const fetchBookings = useCallback(async (signal) => {
        const response = await authenticatedFetch("/bookings", { signal });
        const data = response.ok ? await response.json() : null;

        if (!response.ok) {
            throw new Error(data?.message || "Could not load your bookings.");
        }

        return Array.isArray(data) ? data.map(normalizeBooking) : [];
    }, []);

    // Once the session is known to be absent there is nothing to wait for, so
    // the empty state is resolved during render rather than in an effect,
    // which would otherwise flash the empty state while the session loads.
    if (!isSessionPending && !userEmail && bookings === null) {
        setBookings([]);
    }

    useEffect(() => {
        if (!userEmail) return undefined;

        const controller = new AbortController();

        // State is written from the promise callbacks, never synchronously
        // inside the effect body.
        fetchBookings(controller.signal)
            .then((rows) => {
                setBookings(rows);
                setError(null);
            })
            .catch((loadError) => {
                if (loadError.name === "AbortError") return;
                setBookings([]);
                setError(loadError.message);
            });

        return () => controller.abort();
    }, [userEmail, fetchBookings]);

    /**
     * Starts checkout for an accepted booking.
     *
     * With live Stripe keys the browser is sent to the hosted Checkout page.
     * In mock mode there is no hosted page, so the payment is confirmed
     * straight away through the mock endpoint the server exposes for exactly
     * this case.
     */
    const handlePay = async (ticket) => {
        setPayingId(ticket.id);
        setPayError(null);

        try {
            const response = await authenticatedFetch(
                `/bookings/${encodeURIComponent(ticket.id)}/checkout`,
                { method: "POST" }
            );
            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message || "Could not start the payment.");
            }

            if (data?.mock) {
                const confirmResponse = await authenticatedFetch(
                    `/bookings/${encodeURIComponent(ticket.id)}/confirm`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ bookingId: ticket.id }),
                    }
                );
                const confirmData = await confirmResponse.json().catch(() => null);

                if (!confirmResponse.ok) {
                    throw new Error(confirmData?.message || "The payment could not be recorded.");
                }

                setBookings(await fetchBookings());
                return;
            }

            if (data?.url) {
                window.location.href = data.url;
                return;
            }

            throw new Error("The payment provider did not return a checkout URL.");
        } catch (payFlowError) {
            setPayError({ bookingId: ticket.id, message: payFlowError.message });
        } finally {
            setPayingId(null);
        }
    };

    const isLoading = bookings === null;
    return (
        <div className="max-w-6xl">
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                        My Booked Tickets
                    </h1>
                    <p className="mt-1 text-xs text-slate-400">
                        {isLoading
                            ? "Loading…"
                            : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />}
            </div>

            {error && (
                <p role="alert" className="mb-6 rounded-xl border border-rose-500/25 bg-rose-950/25 p-3 text-xs text-rose-300">
                    {error}
                </p>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-96 animate-pulse rounded-2xl border border-hairline/5 bg-[var(--surface-inset)]"
                        />
                    ))}
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((ticket) => (
                        <BookingCard
                            key={ticket.id}
                            ticket={ticket}
                            onView={setSelectedTicket}
                            onPay={handlePay}
                            payingId={payingId}
                            payError={payError}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-16 rounded-2xl border border-dashed border-hairline/10 p-12 text-center">
                    <p className="text-base font-medium text-slate-300">No bookings yet</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Browse available tickets and place your first booking request.
                    </p>
                    <Link
                        href="/tickets"
                        className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-hover"
                    >
                        Browse Tickets
                    </Link>
                </div>
            )}

            {selectedTicket && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-shade/70 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedTicket(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline/10 bg-[var(--surface-inset)] p-6 shadow-2xl text-slate-100"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-hairline/10 hover:text-white"
                            aria-label="Close dialog"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-[var(--accent-ink)]">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold">Booking Pass — {selectedTicket.pnr}</h2>
                                <p className="text-xs text-slate-400">
                                    {selectedTicket.operator} · {selectedTicket.type}
                                </p>
                            </div>
                        </div>
                        <div className="mb-5 space-y-3 rounded-xl border border-hairline/5 bg-shade/30 p-4 text-xs">
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
                                <span className="text-[var(--accent-ink)]">
                                    ৳{selectedTicket.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedTicket(null)}
                                className="flex-1 rounded-xl border border-hairline/10 bg-hairline/5 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-hairline/10"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
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
