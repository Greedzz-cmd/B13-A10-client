import { Navbar } from "@/components/Navbar";
import TicketsPage from "@/components/TicketsPage";

export const metadata = {
    // Ticket browsing page metadata.
    title: "All tickets | Routely",
};

export default function TicketsRoute() {
    // Render navigation above the ticket filters.
    return (
        <>
            <Navbar />
            <TicketsPage />
        </>
    );
}
