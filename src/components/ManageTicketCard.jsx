import { ArrowRight, BusFront, CalendarDays, Check, Plane, Ship, TrainFront, X } from "lucide-react";

const modeIcons = {
    flight: Plane,
    train: TrainFront,
    launch: Ship,
    bus: BusFront,
};

const statusStyles = {
    pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-red-500/15 text-red-400",
};

export function ManageTicketCard({ ticket, onApprove, onReject }) {
    const mode = ticket.transportType || "Bus";
    const ModeIcon = modeIcons[mode.toLowerCase()] || BusFront;
    const status = (ticket.verificationStatus || "pending").toLowerCase();

    return (
        <article className="group overflow-hidden rounded-2xl border border-hairline/8 bg-[var(--surface)] shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition hover:border-[#dd7845]/30">
            <div className="border-b border-hairline/6 bg-linear-to-br from-hairline/4.5 to-transparent px-4 pb-4 pt-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                        <CalendarDays className="h-3 w-3 text-[var(--accent-ink)]" />
                        {ticket.departureDateTime ? new Date(ticket.departureDateTime).toISOString().slice(0, 10) : "Date unavailable"}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
                <div className="mt-4 flex items-center gap-2.5">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold tracking-[-0.02em] text-slate-100">{ticket.from}</p>
                        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Origin</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent-ink)] transition-transform group-hover:translate-x-0.5" />
                    <div className="min-w-0 flex-1 text-right">
                        <p className="truncate text-base font-semibold tracking-[-0.02em] text-slate-100">{ticket.to}</p>
                        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Destination</p>
                    </div>
                </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4">
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Operator</dt>
                    <dd className="mt-1 truncate text-xs font-medium text-slate-300">{ticket.vendorName || ticket.title}</dd>
                </div>
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Mode</dt>
                    <dd className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300"><ModeIcon className="h-3 w-3 text-[var(--accent-ink)]" />{mode}</dd>
                </div>
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Price</dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-[var(--accent-ink)]">{ticket.price}</dd>
                </div>
            </dl>
            <div className="relative z-10 grid grid-cols-2 gap-2 border-t border-hairline/6 px-4 py-3">
                <button
                    type="button"
                    onClick={onApprove}
                    disabled={status === "approved"}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-emerald-400/15 disabled:hover:bg-emerald-400/10"
                    aria-label={`Approve ${ticket.from} to ${ticket.to}`}
                >
                    <Check className="h-3.5 w-3.5" />Approve
                </button>
                <button
                    type="button"
                    onClick={onReject}
                    disabled={status === "rejected"}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-red-400/15 bg-red-400/10 px-3 text-xs font-semibold text-red-300 transition hover:border-red-400/30 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-red-400/15 disabled:hover:bg-red-400/10"
                    aria-label={`Reject ${ticket.from} to ${ticket.to}`}
                >
                    <X className="h-3.5 w-3.5" />Reject
                </button>
            </div>
        </article>
    );
}