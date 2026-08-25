import Link from "next/link";

function formatTime(value) {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(
        new Date(value),
    );
}

function formatPrice(price) {
    return `৳${Number(price).toLocaleString("en-IN")}`;
}

function modeIcon(type) {
    return { Flight: "✈", Train: "▣", Bus: "▧", Launch: "♧" }[type] || "•";
}

function getFareClass(ticket) {
    const perkCount = ticket.perks?.length || 0;
    if (ticket.price >= 3000 || perkCount >= 4) return "Business";
    if (ticket.price <= 700) return "First";
    return "Economy";
}

export default function TicketCard({ ticket }) {
    const fareClass = getFareClass(ticket);
    const arrivalTime = new Date(new Date(ticket.departureDateTime).getTime() + 240 * 60000);
    const fromCode = ticket.from === "Chattogram" ? "CGP" : ticket.from.slice(0, 3).toUpperCase();
    const toCode = ticket.to === "Chattogram" ? "CGP" : ticket.to.slice(0, 3).toUpperCase();

    return (
        <article className="rounded-lg border border-[#1e3a5f] bg-[#0f172a] p-5 text-slate-100">
            <div className="flex items-start justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-slate-300">
                    <span aria-hidden="true">{modeIcon(ticket.transportType)}</span>
                    {ticket.transportType}
                    <small className="rounded bg-[#1e3a5f] px-1.5 py-0.5 text-[9px] text-[#dd7845]">{fareClass}</small>
                </span>
                <span className="text-right text-base font-semibold text-slate-100">
                    {formatPrice(ticket.price)}
                    <small className="block text-[9px] font-normal text-slate-500">per seat</small>
                </span>
            </div>
            <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                    <strong className="block text-2xl font-semibold">{fromCode}</strong>
                    <small className="block text-[10px] text-slate-400">{ticket.from}</small>
                    <time className="mt-1 block text-xs text-slate-300">{formatTime(ticket.departureDateTime)}</time>
                </div>
                <div className="text-center text-[10px] text-slate-500" aria-hidden="true">
                    <span className="block">
                        ••{" "}
                        {ticket.transportType === "Flight"
                            ? "2h 40m"
                            : ticket.transportType === "Launch"
                              ? "8h 00m"
                              : "6h 40m"}
                    </span>
                    <i className="mt-2 block h-px w-20 bg-slate-600" />
                </div>
                <div className="text-right">
                    <strong className="block text-2xl font-semibold">{toCode}</strong>
                    <small className="block text-[10px] text-slate-400">{ticket.to}</small>
                    <time className="mt-1 block text-xs text-slate-300">{formatTime(arrivalTime)}</time>
                </div>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
                <span>{ticket.vendorName}</span>
                <span>
                    <b className="text-slate-200">{ticket.quantity}</b> seats left
                </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>
                    ★ 4.{(ticket.perks?.length || 1) + 1} ({ticket.quantity * 13})
                </span>
                <span className="h-1 w-20 overflow-hidden rounded-full bg-slate-700">
                    <i
                        className="block h-full bg-[#dd7845]"
                        style={{ width: `${Math.max(12, Math.min(92, ticket.quantity))}%` }}
                    />
                </span>
            </div>
            <Link
                className="mt-4 block rounded bg-[#dd7845] px-3 py-2 text-center text-xs text-white transition hover:bg-[#ef8a53]"
                href={`/tickets/${ticket._id}`}
            >
                View ticket
            </Link>
        </article>
    );
}
