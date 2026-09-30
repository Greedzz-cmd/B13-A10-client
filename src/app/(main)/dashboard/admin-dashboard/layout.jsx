import { requireDashboardRole } from "@/lib/dashboard-server";

export default async function AdminDashboardLayout({ children }) {
    await requireDashboardRole("admin", "/dashboard/admin-dashboard");

    return children;
}
