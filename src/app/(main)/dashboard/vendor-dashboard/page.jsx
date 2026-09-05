import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { UserProfile } from "@/components/UserProfile";

export const metadata = {
    title: "Vendor Dashboard | Routely",
};

const VendorDashboard = () => {
    return (
        <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-60px)] bg-[#080f1d]">
            <Sidebar role="vendor" />
            <main className="flex-1 p-6 md:p-10 text-slate-100 min-w-0">
                <UserProfile role="vendor" />
            </main>
            <button
                type="button"
                className="fixed bottom-5 right-5 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#131b2e] text-xs font-semibold text-slate-300 shadow-lg transition-all hover:bg-white/15 hover:text-white"
                aria-label="Help and Support"
                title="Help & Support"
            >
                ?
            </button>
        </div>
    );
};

export default VendorDashboard;