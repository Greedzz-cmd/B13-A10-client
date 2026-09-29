import Link from "next/link";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import VendorTicketGrid from "@/components/VendorTicketGrid";

export const metadata = {
    title: "My Added Tickets | Routely",
};

export default function MyTicketsPage() {
    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
            <Sidebar role="vendor" />
            <main className="min-w-0 flex-1 p-5 text-slate-100 sm:p-8 lg:p-10">
                <div className="mx-auto max-w-330">
                    <header className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-400">Vendor workspace</p>
                            <h1 className="mt-2 font-serif text-3xl font-medium tracking-[-0.04em] text-slate-100">My Added Tickets</h1>
                            <p className="mt-1 text-xs text-slate-400">Updates go live after admin approval</p>
                        </div>
                        <Link href="/dashboard/vendor-dashboard/add-ticket" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white transition hover:bg-brand-hover">
                            <Plus className="h-3.5 w-3.5" /> Add ticket
                        </Link>
                    </header>

                    <VendorTicketGrid />
                </div>
            </main>
            <button type="button" className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-hairline/10 bg-[var(--surface)] text-xs font-semibold text-slate-300 shadow-lg transition hover:bg-hairline/15 hover:text-white" aria-label="Help and Support" title="Help & Support">
                ?
            </button>
        </div>
    );
}
