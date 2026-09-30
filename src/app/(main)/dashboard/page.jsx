import { auth } from "@/lib/auth";
import { signInHref } from "@/lib/auth-redirect";
import { getDashboardPath } from "@/lib/dashboard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    redirect(session?.user ? getDashboardPath(session.user.role) : signInHref("/dashboard"));
}
