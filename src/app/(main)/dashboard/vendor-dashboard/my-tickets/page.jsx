import Link from "next/link";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import VendorTicketGrid from "@/components/VendorTicketGrid";

export const metadata = {
    title: "My Added Tickets | Routely",
};

const fallbackTickets = [
    {
        _id: "cox-bazar-train",
        title: "Cox's Bazar Express",
        from: "Dhaka",
        to: "Cox's Bazar",
        price: 750,
        quantity: 120,
        totalSeats: 120,
        departureDateTime: "2026-10-08T10:00:00",
        arrivalDateTime: "2026-10-08T20:30:00",
        duration: "10h 30m",
        transportType: "Train",
        verificationStatus: "approved",
        perks: ["AC Coach", "Charging Ports", "Pantry Car", "WiFi"],
        image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "regent-airways",
        title: "Regent Airways",
        from: "Sylhet",
        to: "Dhaka",
        price: 3100,
        quantity: 72,
        totalSeats: 72,
        departureDateTime: "2026-10-22T13:15:00",
        arrivalDateTime: "2026-10-22T14:10:00",
        duration: "0h 55m",
        transportType: "Flight",
        verificationStatus: "pending",
        perks: ["Snack", "Carry-on", "Fast Boarding"],
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "speedboat-express",
        title: "Speedboat Express",
        from: "Dhaka",
        to: "Chandpur",
        price: 420,
        quantity: 20,
        totalSeats: 40,
        departureDateTime: "2026-11-05T07:00:00",
        arrivalDateTime: "2026-11-05T10:30:00",
        duration: "3h 30m",
        transportType: "Launch",
        verificationStatus: "pending",
        perks: ["Deck View", "Snack", "Life Jacket"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=900&auto=format&fit=crop",
    },
    {
        _id: "hanif-enterprise",
        title: "Hanif Enterprise",
        from: "Dhaka",
        to: "Sylhet",
        price: 880,
        quantity: 0,
        totalSeats: 40,
        departureDateTime: "2026-11-16T21:30:00",
        arrivalDateTime: "2026-11-17T06:20:00",
        duration: "8h 20m",
        transportType: "Bus",
        verificationStatus: "rejected",
        perks: ["AC", "WiFi", "USB Charging", "Blanket"],
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop",
    },
];

async function getTickets() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return fallbackTickets;

    try {
        const response = await fetch(`${apiUrl}/tickets`, { cache: "no-store" });
        const tickets = await response.json();
        return Array.isArray(tickets) && tickets.length > 0 ? tickets : fallbackTickets;
    } catch {
        return fallbackTickets;
    }
}

export default async function MyTicketsPage() {
    const tickets = await getTickets();

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

                    <VendorTicketGrid initialTickets={tickets} />
                </div>
            </main>
            <button type="button" className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-hairline/10 bg-[var(--surface)] text-xs font-semibold text-slate-300 shadow-lg transition hover:bg-hairline/15 hover:text-white" aria-label="Help and Support" title="Help & Support">
                ?
            </button>
        </div>
    );
}
