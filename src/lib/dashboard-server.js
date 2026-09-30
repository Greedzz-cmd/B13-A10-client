import { auth } from "@/lib/auth";
import { signInHref } from "@/lib/auth-redirect";
import { getDashboardPath } from "@/lib/dashboard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Accounts store the role as "traveller". Rows written before the rename still
// hold "user", so both spellings are accepted and normalised on the way out.
const normalizeRole = (role) => (role === "user" ? "traveller" : role || "traveller");

/**
 * Protect a dashboard segment and keep authenticated users in their own area.
 *
 * `currentPath` is what a signed-out visitor was trying to reach; it rides
 * along to the sign-in page so they land back here afterwards.
 */
export async function requireDashboardRole(requiredRole, currentPath) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect(signInHref(currentPath));

    const userRole = normalizeRole(session.user.role);
    if (userRole !== requiredRole) redirect(getDashboardPath(userRole));

    return session;
}
