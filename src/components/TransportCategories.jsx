import Link from "next/link";

const categories = [
    {
        href: "/tickets?transport=flight",
        name: "Flights",
        description: "Fastest city hops",
        available: "4 tickets available",
        className: "border-[#2d4f87] bg-[#192945]",
        icon: "flight",
    },
    {
        href: "/tickets?transport=train",
        name: "Trains",
        description: "Scenic overland routes",
        available: "3 tickets available",
        className: "border-[#20565b] bg-[#143039]",
        icon: "train",
    },
    {
        href: "/tickets?transport=launch",
        name: "Launches",
        description: "River & coastal journeys",
        available: "3 tickets available",
        className: "border-[#514675] bg-[#242440]",
        icon: "launch",
    },
    {
        href: "/tickets?transport=bus",
        name: "Buses",
        description: "Comfortable road travel",
        available: "2 tickets available",
        className: "border-[#68442e] bg-[#2a2225]",
        icon: "bus",
    },
];

function TransportIcon({ type }) {
    const paths = {
        flight: (
            <path d="m4 13 6.5-1.5L15 5.8c.7-.9 2.1-1.1 3-.4.7.6.8 1.6.2 2.3L14 12.5l2.5 5.7-1.9.7-3.6-5-3.6 2.2.1 2.4-1.4.5-1.2-3.5-2.5-1.8L4 13Z" />
        ),
        train: (
            <>
                <rect x="6" y="4" width="12" height="13" rx="2" />
                <path d="M9 17 7 20m8-3 2 3M7 12h10M9 8h.01M15 8h.01" />
            </>
        ),
        launch: (
            <>
                <path d="M4 15.5c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5" />
                <path d="M7 13V8h10v5m-5-5V4m-3 4 3-2 3 2m-6 8-1 3m7-3 1 3" />
            </>
        ),
        bus: (
            <>
                <rect x="4" y="6" width="16" height="11" rx="2" />
                <path d="M4 12h16M8 17v2m8-2v2M7.5 9h.01M16.5 9h.01" />
            </>
        ),
    };

    return (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
                {paths[type]}
            </g>
        </svg>
    );
}

export default function TransportCategories() {
    return (
        <section className="border-t border-white/[0.02] bg-[#080f1d] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
            <div className="mx-auto max-w-[1232px]">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#dd7845]">How you travel</p>
                <h2 className="mt-3 font-serif text-[30px] leading-none text-slate-100 sm:text-[32px]">
                    Transport categories
                </h2>
                <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map(category => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className={`group flex min-h-[176px] flex-col rounded-[11px] border p-6 transition-transform duration-200 hover:-translate-y-1 ${category.className}`}
                        >
                            <span className="text-[#ed7b3b]">
                                <TransportIcon type={category.icon} />
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
