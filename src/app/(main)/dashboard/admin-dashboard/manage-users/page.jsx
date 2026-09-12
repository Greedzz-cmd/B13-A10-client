"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Shield, UserCheck, AlertTriangle, Check, User, ShieldAlert } from "lucide-react";

const INITIAL_USERS = [
    {
        _id: "usr-1",
        name: "Nusrat Jahan",
        email: "nusrat@example.com",
        role: "admin",
        isFraud: false,
        createdAt: "2024-01-15",
    },
    {
        _id: "usr-2",
        name: "Greenline Transport Ltd",
        email: "contact@greenline.bd",
        role: "vendor",
        isFraud: false,
        createdAt: "2024-03-10",
    },
    {
        _id: "usr-3",
        name: "Shohag Paribahan",
        email: "support@shohag.com",
        role: "vendor",
        isFraud: false,
        createdAt: "2024-04-05",
    },
    {
        _id: "usr-4",
        name: "Rahim Chowdhury",
        email: "rahim.chowdhury@gmail.com",
        role: "user",
        isFraud: false,
        createdAt: "2024-05-12",
    },
    {
        _id: "usr-5",
        name: "Sadia Afrin",
        email: "sadia.afrin@outlook.com",
        role: "user",
        isFraud: false,
        createdAt: "2024-06-20",
    },
    {
        _id: "usr-6",
        name: "Fake Tickets Express",
        email: "scam.vendor@fraud.net",
        role: "vendor",
        isFraud: true,
        createdAt: "2024-07-01",
    },
];

const roleStyles = {
    admin: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    vendor: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    user: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        fetch(`${apiUrl}/users`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setUsers(data);
                }
            })
            .catch(() => {});
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const previousUsers = users;
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            try {
                const res = await fetch(`${apiUrl}/users/${userId}/role`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: newRole }),
                });
                if (!res.ok) throw new Error("Failed to update role");
            } catch {
                setUsers(previousUsers);
                setStatusMessage("Failed to update role on server.");
                return;
            }
        }
        setStatusMessage(`User promoted to ${newRole}.`);
        setTimeout(() => setStatusMessage(""), 3000);
    };

    const handleMarkFraud = async (userId, userEmail) => {
        if (!confirm(`Are you sure you want to mark ${userEmail} as fraud? All of this vendor's tickets will be hidden immediately.`)) {
            return;
        }

        const previousUsers = users;
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, isFraud: true } : u))
        );

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            try {
                const res = await fetch(`${apiUrl}/users/${userId}/fraud`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) throw new Error("Failed to flag user");
            } catch {
                setUsers(previousUsers);
                setStatusMessage("Failed to mark user as fraud.");
                return;
            }
        }
        setStatusMessage("Vendor marked as fraud. All their tickets have been hidden.");
        setTimeout(() => setStatusMessage(""), 4000);
    };

    const totalVendors = users.filter((u) => u.role === "vendor").length;
    const fraudVendors = users.filter((u) => u.isFraud).length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
            <Sidebar role="admin" activeId="manage-users" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    {/* Metrics Row */}
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/8 bg-[#131d31] p-4">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                                Total Platform Users
                            </span>
                            <p className="mt-1 font-serif text-2xl text-teal-400">{users.length}</p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-[#131d31] p-4">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                                Active Vendors
                            </span>
                            <p className="mt-1 font-serif text-2xl text-blue-400">{totalVendors}</p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-[#131d31] p-4">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                                Flagged Fraud Vendors
                            </span>
                            <p className="mt-1 font-serif text-2xl text-rose-400">{fraudVendors}</p>
                        </div>
                    </div>

                    <header className="mb-6 mt-7 flex items-end justify-between">
                        <div>
                            <h1 className="font-serif text-3xl font-medium tracking-tight text-white">
                                Manage Users
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Control user roles and take administrative fraud prevention action.
                            </p>
                        </div>
                        {statusMessage && (
                            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 animate-fade-in">
                                {statusMessage}
                            </span>
                        )}
                    </header>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#131d31]">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">User</th>
                                    <th className="px-4 py-3.5">Role</th>
                                    <th className="px-4 py-3.5">Fraud Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {users.map((u) => {
                                    const isVendor = u.role === "vendor";
                                    return (
                                        <tr
                                            key={u._id}
                                            className={`transition-colors hover:bg-white/[0.02] ${
                                                u.isFraud ? "bg-rose-950/10" : ""
                                            }`}
                                        >
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium text-slate-200">{u.name}</p>
                                                <p className="font-mono text-[11px] text-slate-400">{u.email}</p>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${
                                                        roleStyles[u.role] || roleStyles.user
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {u.isFraud ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                                                        <ShieldAlert className="h-3 w-3" /> FRAUD
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                                        <Check className="h-3 w-3" /> Clean
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoleChange(u._id, "admin")}
                                                        disabled={u.role === "admin"}
                                                        className="inline-flex items-center gap-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-medium text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Shield className="h-3 w-3" /> Make Admin
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoleChange(u._id, "vendor")}
                                                        disabled={u.role === "vendor"}
                                                        className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-300 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <UserCheck className="h-3 w-3" /> Make Vendor
                                                    </button>
                                                    {isVendor && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMarkFraud(u._id, u.email)}
                                                            disabled={u.isFraud}
                                                            className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-[10px] font-medium text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <AlertTriangle className="h-3 w-3 text-rose-400" /> Mark as Fraud
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
