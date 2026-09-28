import RoleOnboardingClient from "@/components/RoleOnboardingClient";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/dashboard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RoleOnboardingPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect("/sign-in");
    if (session.user.roleSelected) redirect(getDashboardPath(session.user.role));

    return <RoleOnboardingClient />;
}
