import Link from "next/link";

export default function JourneyCtaSection() {
    return (
        <section className="relative overflow-hidden border-b border-hairline/[0.04] bg-[var(--surface-canvas)] px-6 py-20 text-center sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(51,67,97,0.16),transparent_35%)]" />
            <div className="relative mx-auto max-w-[430px]">
                <p className="text-[8px] uppercase tracking-[0.25em] text-[var(--accent-ink)]">Ready to travel?</p>
                <h2 className="mx-auto mt-3 max-w-[290px] font-serif text-[28px] leading-[1.05] text-slate-100 sm:text-[31px]">
                    Your next journey
                    <br />
                    <span className="text-[var(--accent-ink)]">starts here.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-[330px] text-[10px] leading-4 text-slate-500">
                    Thousands of routes. Instant confirmation. Bangladesh&apos;s most trusted travel platform.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <Link
                        href="tickets"
                        className="rounded-[5px] bg-brand px-4 py-2.5 text-[10px] font-medium text-white transition-colors hover:bg-brand-hover"
                    >
                        Explore tickets <span className="ml-1.5">→</span>
                    </Link>
                    <Link
                        href="/get-started"
                        className="text-[9px] text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white"
                    >
                        Create free account
                    </Link>
                </div>
            </div>
        </section>
    );
}
