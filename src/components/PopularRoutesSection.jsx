import { BusFront, PlaneTakeoff, Ship, TramFront } from "lucide-react";
import Link from "next/link";

/**
 * Shown only when the catalogue request fails, so the homepage still renders
 * something useful offline. Names here must match the seeded locations.
 */
const fallbackRoutes = [
    { from: "Dhaka", to: "Chattogram", duration: "1h–4.5h", fromPrice: 480, dailyCount: "120+", transport: ["Flight", "Train", "Bus", "Launch"] },
    { from: "Dhaka", to: "Sylhet", duration: "1h–6h", fromPrice: 620, dailyCount: "60+", transport: ["Flight", "Train", "Bus"] },
    { from: "Dhaka", to: "Cox's Bazar", duration: "45m–9h", fromPrice: 1100, dailyCount: "40+", transport: ["Flight", "Bus"] },
    { from: "Dhaka", to: "Khulna", duration: "8h–12h", fromPrice: 950, dailyCount: "30+", transport: ["Bus", "Launch"] },
    { from: "Dhaka", to: "Rajshahi", duration: "5h–6h", fromPrice: 480, dailyCount: "50+", transport: ["Train", "Bus"] },
    { from: "Dhaka", to: "Barishal", duration: "3h–8h", fromPrice: 350, dailyCount: "20+", transport: ["Launch", "Bus"] },
];

/** IATA-like codes for the route badges, matched by destination. */
const routeCodes = {
    Chattogram: ["DAC", "CGP"],
    Sylhet: ["DAC", "ZYL"],
    "Cox's Bazar": ["DAC", "CXB"],
    Khulna: ["DAC", "KHL"],
    Rajshahi: ["DAC", "RSH"],
    Barishal: ["DAC", "BZL"],
    Rangpur: ["DAC", "RGP"],
    Mymensingh: ["DAC", "MYS"],
};

/** Builds a catalogue link with the query values encoded. */
const buildHref = (from, to) => `/tickets?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

const toPopularRoute = (route) => {
    const [fromCode, toCode] = routeCodes[route.to] || ["", ""];
    const isLive = route.ticketCount !== undefined;

    return {
        fromCode,
        toCode,
        from: route.from,
        to: route.to,
        // Live routes show the next departure, the fallback keeps its estimate.
        duration: isLive && route.nextDeparture
            ? new Date(route.nextDeparture).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
            })
            : route.duration,
        fromPrice: route.fromPrice,
        ticketLabel: isLive
            ? `${route.ticketCount} ${route.ticketCount === 1 ? "ticket" : "tickets"}`
            : `${route.dailyCount} daily`,
        transport: route.transport || route.transportTypes || [],
        href: buildHref(route.from, route.to),
    };
};

const transportIcons = {
    Flight: PlaneTakeoff,
    Train: TramFront,
    Bus: BusFront,
    Launch: Ship,
};

function RouteCard({ route }) {
    return (
        <Link
            href={route.href}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-inset)] p-5 transition-all duration-200 hover:border-brand/50 hover:bg-[var(--surface)]"
        >
            {/* Arrow link indicator */}
            <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border border-[var(--line)] text-slate-500 transition-colors group-hover:border-brand/60 group-hover:text-[var(--accent-ink)]">
                <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>

            {/* Route code heading */}
            <div>
                <p className="font-mono text-[19px] font-semibold leading-tight text-slate-100 tracking-tight">
                    {route.fromCode}
                    <span className="mx-1.5 text-[var(--accent-ink)]">→</span>
                    {route.toCode}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                    {route.from} → {route.to}
                </p>
            </div>

            {/* Transport mode icon dots */}
            <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                {route.transport.map(mode => {
                    const Icon = transportIcons[mode];
                    return (
                        <span key={mode} title={mode} className="text-slate-500">
                            <Icon aria-label={mode} className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </span>
                    );
                })}
                <span className="h-2 w-2 shrink-0 rounded-full border border-slate-700" aria-hidden="true" />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5 text-[11px] font-mono">
                <span className="text-slate-400">{route.duration}</span>
                <span>
                    <span className="text-slate-500">from </span>
                    <span className="font-semibold text-[var(--accent-ink)]">৳{route.fromPrice.toLocaleString("en-IN")}</span>
                </span>
                <span className="text-slate-500">{route.ticketLabel}</span>
            </div>
        </Link>
    );
}

export default function PopularRoutesSection({ routes = [] }) {
    // Prefer the live catalogue; fall back only when the API had nothing.
    const source = routes.length > 0 ? routes : fallbackRoutes;
    const popularRoutes = source.map(toPopularRoute);

    return (
        <section className="border-t border-hairline/[0.03] bg-[var(--surface-canvas)] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
            <div className="mx-auto max-w-[1260px]">
                {/* Section header */}
                <div className="mb-10">
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--accent-ink)]">
                        Most booked
                    </p>
                    <h2 className="mt-3 font-serif text-[34px] font-normal leading-tight text-slate-100 sm:text-[42px]">
                        Popular routes
                    </h2>
                </div>

                {/* 3-col route grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {popularRoutes.map(route => (
                        <RouteCard key={`${route.fromCode}-${route.toCode}`} route={route} />
                    ))}
                </div>
            </div>
        </section>
    );
}
