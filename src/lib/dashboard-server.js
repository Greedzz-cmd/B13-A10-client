import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/dashboard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const normalizeRole = (role) => (role === "traveller" ? "user" : role || "user");

/**
 * Protect a dashboard segment and keep authenticated users in their own area.
 */
export async function requireDashboardRole(requiredRole) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect("/sign-in");

    const userRole = normalizeRole(session.user.role);
    if (userRole !== requiredRole) redirect(getDashboardPath(userRole));

    return session;
}
