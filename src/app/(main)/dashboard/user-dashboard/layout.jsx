import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { requireDashboardRole } from "@/lib/dashboard-server";

export const metadata = {
    title: "User Dashboard | Routely",
    description: "Manage your profile, booked tickets, and transaction history.",
};

export default async function UserDashboardLayout({ children }) {
    await requireDashboardRole("user");

    return (
        <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-60px)] bg-[var(--surface-canvas)]">
            {/* Sidebar navigation */}
            <Sidebar role="user" />

            {/* Main content viewport */}
            <main className="flex-1 p-6 md:p-10 text-slate-100 min-w-0">
                {children}
            </main>

            {/* Floating Quick Help trigger */}
            <button
                type="button"
                className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-hairline/10 bg-[var(--surface)] text-xs font-semibold text-slate-300 shadow-lg transition-all hover:bg-hairline/15 hover:text-white"
                aria-label="Help and Support"
                title="Help & Support"
            >
                ?
            </button>
        </div>
    );
}
