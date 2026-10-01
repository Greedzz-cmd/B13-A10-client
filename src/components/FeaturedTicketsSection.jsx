import { Plane } from "lucide-react";
import Link from "next/link";
import TicketCard from "./TicketCard";
import { apiBaseUrl, apiUrl } from "@/lib/api-url";


export default async function FeaturedTicketsSection() {
    let featuredTickets = [];

    if (apiBaseUrl()) {
        try {
            // /tickets no longer accepts isAdvertised; the dedicated route
            // returns exactly the six approved tickets admins may feature.
            const res = await fetch(apiUrl("/tickets/advertised"), { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    featuredTickets = data;
                }
            }
        } catch {
            // Silently fall back to empty array; section will render empty state
        }
    }

    if (featuredTickets.length === 0) return null;

    return (
        <section className="border-b border-hairline/5 bg-[var(--surface-canvas)] px-5 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-[1260px]">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-5">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/60 bg-[var(--surface)] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[var(--accent-ink)] shadow-[0_0_0_1px_var(--brand-glow)]">
                            <Plane aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
                            Admin&apos;s picks
                        </span>

                        <div className="space-y-3">
                            <h2 className="font-serif text-[34px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-100 sm:text-[52px]">
                                Featured tickets
                            </h2>
                            <p className="max-w-[760px] text-[15px] text-slate-400 sm:text-[17px]">
                                Hand-selected by our team for exceptional value and experience.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/tickets"
                        className="hidden items-center gap-2 text-[15px] text-slate-300 transition-colors hover:text-white sm:inline-flex"
                    >
                        View all <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredTickets.map(ticket => (
                        <TicketCard key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            </div>
        </section>
    );
}
