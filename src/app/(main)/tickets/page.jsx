import TicketsPage from "@/components/TicketsPage";


export const metadata = {
    title: "All tickets | Routely",
};

// Server-side ticket data loader with fallback to empty array
export async function getTickets() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
        try {
            const response = await fetch(`${apiUrl}/tickets`, { cache: "no-store" });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    return data;
                }
            }
        } catch (error) {
            console.error("Failed to fetch tickets from API:", error);
        }
    }
    return [];
}

export default async function TicketsRoute({ searchParams }) {
    const params = await searchParams;
    const initialTransport = params?.transport || "";
    const initialFrom = params?.from || "";
    const initialTo = params?.to || "";
    const initialQuery = params?.q || "";
    const tickets = await getTickets();

    return (
        <TicketsPage
            tickets={tickets}
            initialTransport={initialTransport}
            initialFrom={initialFrom}
            initialTo={initialTo}
            initialQuery={initialQuery}
            key={`${initialTransport}-${initialFrom}-${initialTo}-${initialQuery}`}
        />
    );
}
