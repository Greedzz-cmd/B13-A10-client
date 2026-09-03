import { BusFront, PlaneTakeoff, Ship, TramFront } from "lucide-react";
import Link from "next/link";

// Popular routes across Bangladesh with static metadata.
const popularRoutes = [
    {
        fromCode: "DAC",
        toCode: "CGP",
        from: "Dhaka",
        to: "Chittagong",
        duration: "1h–4.5h",
        fromPrice: 480,
        dailyCount: "120+",
        transport: ["Flight", "Train", "Bus", "Launch"],
        href: "/tickets?transport=flight",
    },
    {
        fromCode: "DAC",
        toCode: "ZYL",
        from: "Dhaka",
        to: "Sylhet",
        duration: "1h–6h",
        fromPrice: 620,
        dailyCount: "60+",
        transport: ["Flight", "Train", "Bus"],
        href: "/tickets?transport=flight",
    },
    {
        fromCode: "DAC",
        toCode: "CXB",
        from: "Dhaka",
        to: "Cox's Bazar",
        duration: "45m–9h",
        fromPrice: 1100,
        dailyCount: "40+",
        transport: ["Flight", "Bus"],
        href: "/tickets?transport=flight",
    },
    {
        fromCode: "DAC",
        toCode: "KHL",
        from: "Dhaka",
        to: "Khulna",
        duration: "8h–12h",
        fromPrice: 950,
        dailyCount: "30+",
        transport: ["Bus", "Launch"],
        href: "/tickets?transport=bus",
    },
    {
        fromCode: "DAC",
        toCode: "RSH",
        from: "Dhaka",
        to: "Rajshahi",
        duration: "5h–6h",
        fromPrice: 480,
        dailyCount: "50+",
        transport: ["Train", "Bus"],
        href: "/tickets?transport=train",
    },
    {
        fromCode: "DAC",
        toCode: "BZL",
        from: "Dhaka",
        to: "Barishal",
        duration: "3h–8h",
        fromPrice: 350,
        dailyCount: "20+",
        transport: ["Launch", "Bus"],
        href: "/tickets?transport=launch",
    },
];

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
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#1e2d42] bg-[#0e1929] p-5 transition-all duration-200 hover:border-[#dd7845]/50 hover:bg-[#111e30]"
        >
            {/* Arrow link indicator */}
            <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border border-[#1e2d42] text-slate-500 transition-colors group-hover:border-[#dd7845]/60 group-hover:text-[#dd7845]">
                <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>

            {/* Route code heading */}
            <div>
                <p className="font-mono text-[19px] font-semibold leading-tight text-slate-100 tracking-tight">
                    {route.fromCode}
                    <span className="mx-1.5 text-[#dd7845]">→</span>
                    {route.toCode}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                    {route.from} → {route.to}
                </p>
            </div>

            {/* Transport mode icon dots */}
            <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#dd7845]" aria-hidden="true" />
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
                    <span className="font-semibold text-[#dd7845]">৳{route.fromPrice.toLocaleString("en-IN")}</span>
                </span>
                <span className="text-slate-500">{route.dailyCount} daily</span>
            </div>
        </Link>
    );
}

export default function PopularRoutesSection() {
    return (
        <section className="border-t border-white/[0.03] bg-[#080f1d] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
            <div className="mx-auto max-w-[1260px]">
                {/* Section header */}
                <div className="mb-10">
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#dd7845]">
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
