import { notFound } from "next/navigation";
import TicketDetailsClient from "@/components/TicketDetailsClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
        return { title: "Ticket not found | Routely" };
    }

    return {
        title: `${ticket.from} to ${ticket.to} | Routely`,
        description: `${ticket.title} from ${ticket.from} to ${ticket.to}, ৳${ticket.price} per seat.`,
    };
}

/**
 * Loads one ticket for the detail page.
 *
 * Returns null when the API has no such ticket. The page used to substitute a
 * plausible-looking placeholder in that case, so a mistyped URL, a withdrawn
 * ticket or a momentary API outage all rendered a convincing ticket that
 * could not actually be booked.
 */
async function getTicketById(id) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not set.");
    }

    const res = await fetch(`${apiUrl}/tickets/${encodeURIComponent(id)}`, {
        cache: "no-store",
    });

    // A malformed id is a 400 and an unknown one is a 404. Neither is a
    // server fault: both just mean there is no ticket to show, so they
    // resolve to the not-found page rather than the error boundary.
    if (res.status === 400 || res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`The ticket API responded with ${res.status}.`);
    }

    const data = await res.json();

    return data && (data._id || data.id) ? data : null;
}

export default async function TicketDetailsPage({ params }) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
        notFound();
    }

    return <TicketDetailsClient ticket={ticket} />;
}
