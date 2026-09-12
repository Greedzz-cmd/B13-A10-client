import { BusFront, Check, Plane, Ship, TrainFront, X } from "lucide-react";

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

export function ManageTicketCard({ ticket, onApprove, onReject }) {
    const mode = ticket.transportType || "Bus";
    const ModeIcon = modeIcons[mode.toLowerCase()] || BusFront;
    const status = (ticket.verificationStatus || "pending").toLowerCase();

    return (
        <article className="rounded-xl border border-white/8 bg-[#131d31] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-sm font-medium text-slate-100">{ticket.from} → {ticket.to}</h2>
                    <p className="mt-1 font-mono text-[9px] text-slate-500">{ticket.departureDateTime ? new Date(ticket.departureDateTime).toISOString().slice(0, 10) : "N/A"}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${statusStyles[status] || statusStyles.pending}`}>
                    {status}
                </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-white/6 py-3">
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Operator</dt>
                    <dd className="mt-1 text-xs text-slate-300">{ticket.vendorName || ticket.title}</dd>
                </div>
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Mode</dt>
                    <dd className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-300"><ModeIcon className="h-3 w-3 text-slate-400" />{mode}</dd>
                </div>
                <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Price</dt>
                    <dd className="mt-1 font-mono text-xs text-[#dd7845]">{ticket.price}</dd>
                </div>
            </dl>
            <div className="relative z-10 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={onApprove}
                    disabled={status === "approved"}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-500/10"
                    aria-label={`Approve ${ticket.from} to ${ticket.to}`}
                >
                    <Check className="h-3.5 w-3.5" />Approve
                </button>
                <button
                    type="button"
                    onClick={onReject}
                    disabled={status === "rejected"}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-red-500/10 px-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-500/10"
                    aria-label={`Reject ${ticket.from} to ${ticket.to}`}
                >
                    <X className="h-3.5 w-3.5" />Reject
                </button>
            </div>
        </article>
    );
}