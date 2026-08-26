import { BusFront, PlaneTakeoff, Ship, TramFront } from "lucide-react";
import Link from "next/link";

// Links for the supported transport categories.
const categories = [
    {
        href: "/tickets?transport=flight",
        name: "Flights",
        description: "Fastest city hops",
        available: "4 tickets available",
        className: "border-[#2d4f87] bg-[#192945]",
        icon: PlaneTakeoff,
    },
    {
        href: "/tickets?transport=train",
        name: "Trains",
        description: "Scenic overland routes",
        available: "3 tickets available",
        className: "border-[#20565b] bg-[#143039]",
        icon: TramFront,
    },
    {
        href: "/tickets?transport=launch",
        name: "Launches",
        description: "River & coastal journeys",
        available: "3 tickets available",
        className: "border-[#514675] bg-[#242440]",
        icon: Ship,
    },
    {
        href: "/tickets?transport=bus",
        name: "Buses",
        description: "Comfortable road travel",
        available: "2 tickets available",
        className: "border-[#68442e] bg-[#2a2225]",
        icon: BusFront,
    },
];

function TransportIcon({ icon: Icon }) {
    return <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.7} />;
}

export default function TransportCategories() {
    // Transport category links below the landing page hero.
    return (
        <section className="border-t border-white/[0.02] bg-[#080f1d] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
            <div className="mx-auto max-w-[1232px]">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#dd7845]">How you travel</p>
                <h2 className="mt-3 font-serif text-[30px] leading-none text-slate-100 sm:text-[32px]">
                    Transport categories
                </h2>
                {/* Category cards for browsing by transport type. */}
                <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map(category => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className={`group flex min-h-[176px] flex-col rounded-[11px] border p-6 transition-transform duration-200 hover:-translate-y-1 ${category.className}`}
                        >
                            <span className="text-[#ed7b3b]">
                                <TransportIcon icon={category.icon} />
                            </span>
                            <span className="mt-5 font-serif text-[22px] leading-none text-slate-100">
                                {category.name}
                            </span>
                            <span className="mt-2 text-[12px] text-slate-400">{category.description}</span>
                            <span className="mt-auto pt-4 font-mono text-[11px] tracking-[0.04em] text-[#ed7b3b]">
                                {category.available}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
