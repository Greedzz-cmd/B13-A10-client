import { Navbar } from "@/components/Navbar";
import TicketsPage from "@/components/TicketsPage";

export const metadata = {
    title: "All tickets | Routely",
};

export default function TicketsRoute() {
    return (
        <>
            <Navbar />
            <TicketsPage />
        </>
    );
}
