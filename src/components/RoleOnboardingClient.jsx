"use client";

import { getDashboardPath } from "@/lib/dashboard";
import { BriefcaseBusiness, Luggage } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = [
    { id: "traveller", title: "Traveller", description: "Find, book, and manage your journeys.", Icon: Luggage },
    { id: "vendor", title: "Vendor", description: "List tickets and manage bookings and revenue.", Icon: BriefcaseBusiness },
];

export default function RoleOnboardingClient() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const chooseRole = async (role) => {
        setIsSaving(true);
        setError("");

        try {
            const response = await fetch("/api/account/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unable to save your role.");
            router.replace(getDashboardPath(data.role));
        } catch (saveError) {
            setError(saveError.message || "Unable to save your role.");
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-[60vh] bg-[var(--surface-inset)] px-5 py-16 text-slate-100">
            <section className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-medium text-[var(--accent-ink)]">Welcome to Routely</p>
                <h1 className="mt-2 font-serif text-3xl">How will you use Routely?</h1>
                <p className="mt-3 text-sm text-slate-400">Choose the dashboard that fits you. You can contact support if this needs to change later.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {roles.map(({ id, title, description, Icon }) => (
                        <button key={id} type="button" disabled={isSaving} onClick={() => chooseRole(id)} className="rounded-xl border border-hairline/10 bg-hairline/[0.03] p-6 text-left transition hover:border-brand/60 hover:bg-hairline/[0.06] disabled:cursor-not-allowed disabled:opacity-60">
                            <Icon className="h-7 w-7 text-[var(--accent-ink)]" />
                            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                        </button>
                    ))}
                </div>
                {error && <p className="mt-5 text-sm text-red-400">{error}</p>}
            </section>
        </main>
    );
}
