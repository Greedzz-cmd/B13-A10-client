import MyTripsPage from "@/components/MyTripsPage";
import { Navbar } from "@/components/Navbar";

export const metadata = {
    title: "My trips | Routely",
};

export default function TripsRoute() {
    const items = [
        { href: "/tickets", label: "All Tickets" },
        { href: "/trips", label: "My Trips", isActive: true },
        { href: "/vendors", label: "Vendors" },
        { href: "/admin", label: "Admin" },
    ];

    return (
        <>
            <Navbar items={items} />
            <MyTripsPage />
        </>
    );
}
