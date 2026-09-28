import { requireDashboardRole } from "@/lib/dashboard-server";

export default async function AdminDashboardLayout({ children }) {
    await requireDashboardRole("admin");

    return children;
}
