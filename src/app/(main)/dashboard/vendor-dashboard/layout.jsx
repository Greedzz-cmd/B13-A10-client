import { requireDashboardRole } from "@/lib/dashboard-server";

export default async function VendorDashboardLayout({ children }) {
    await requireDashboardRole("vendor");

    return children;
}
