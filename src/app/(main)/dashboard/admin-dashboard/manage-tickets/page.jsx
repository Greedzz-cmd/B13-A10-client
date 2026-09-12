import ManageTicketsClient from "@/components/ManageTicketsClient";

export const metadata = {
    title: "Manage Tickets | Routely",
};

// Runs on the server on every request. Swap this for a DB call
// (e.g. prisma.ticket.findMany()) if you're not going through an API route.
async function getTickets() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
        cache: "no-store", // always get fresh data; use { next: { revalidate: 60 } } to cache instead
    });

    if (!res.ok) {
        throw new Error("Failed to load tickets");
    }

    return res.json();
}

export default async function ManageTicketsPage() {
    const tickets = await getTickets();

    return <ManageTicketsClient initialTickets={tickets} />;
}