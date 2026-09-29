import Link from "next/link";

const shortcuts = [
    { href: "/tickets", label: "Browse all tickets" },
    { href: "/", label: "Back to home" },
    { href: "/get-started", label: "Create an account" },
];

/**
 * Shared body for both the root and the (main) segment 404 pages. The root
 * boundary renders outside the Navbar layout, so this stays self contained.
 */
export default function NotFoundContent() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-[var(--surface-canvas)] px-6 py-20 sm:px-10">
            <div className="mx-auto w-full max-w-[520px] text-center">
                <p className="text-[8px] uppercase tracking-[0.24em] text-[var(--accent-ink)]">Error 404</p>
                <p className="mt-4 font-serif text-[64px] leading-none text-slate-100 sm:text-[86px]">Lost route</p>
                <p className="mx-auto mt-5 max-w-[380px] text-[12px] leading-5 text-slate-400">
                    This page never made it onto the departure board. The link may be broken, or the trip may have
                    already been cancelled.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/tickets"
                        className="rounded-[5px] bg-[var(--brand-solid)] px-4 py-2.5 text-[10px] font-medium text-white transition-colors hover:bg-[var(--brand-solid-hover)]"
                    >
                        Explore tickets <span className="ml-1.5">→</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-[9px] text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white"
                    >
                        Go back home
                    </Link>
                </div>

                <ul className="mt-12 flex flex-col items-center gap-3 border-t border-hairline/[0.06] pt-8">
                    {shortcuts.map((shortcut) => (
                        <li key={shortcut.href}>
                            <Link
                                href={shortcut.href}
                                className="text-[11px] text-slate-400 transition-colors hover:text-[var(--accent-ink)]"
                            >
                                {shortcut.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
