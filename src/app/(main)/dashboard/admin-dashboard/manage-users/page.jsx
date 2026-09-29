"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Shield, UserCheck, AlertTriangle, Check, ShieldAlert, UserCheck2 } from "lucide-react";
import { authenticatedFetch, readJson, setUserFraud, setUserRole } from "@/lib/api-client";

const roleStyles = {
    admin: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    vendor: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    user: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusTone, setStatusTone] = useState("success");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // /users is admin-only, so an unauthenticated request would come back 401
    // and leave the table looking populated when it is not.
    const fetchUsers = useCallback(async () => {
        const query = new URLSearchParams();
        if (search.trim()) query.set("search", search.trim());
        if (roleFilter) query.set("role", roleFilter);

        const res = await authenticatedFetch(`/users${query.toString() ? `?${query}` : ""}`);

        return readJson(res);
    }, [search, roleFilter]);

    useEffect(() => {
        let cancelled = false;

        fetchUsers()
            .then((data) => {
                if (!cancelled) setUsers(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fetchUsers]);

    const announce = (message, tone = "success") => {
        setStatusTone(tone);
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(""), 4000);
    };

    const handleRoleChange = async (userId, newRole) => {
        const previousUsers = users;
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );

        try {
            await setUserRole(userId, newRole);
            announce(`User promoted to ${newRole}.`);
        } catch (err) {
            setUsers(previousUsers);
            announce(err.message, "error");
        }
    };

    const handleFraudToggle = async (user) => {
        const flag = !user.isFraud;
        const action = flag ? "mark as fraud" : "reinstate";

        if (!window.confirm(`Are you sure you want to ${action} ${user.email}?${
            flag ? " All of this vendor's tickets will be hidden immediately." : ""
        }`)) {
            return;
        }

        const previousUsers = users;
        setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? { ...u, isFraud: flag } : u))
        );

        try {
            const { message } = await setUserFraud(user._id, flag);
            announce(message);
        } catch (err) {
            setUsers(previousUsers);
            announce(err.message, "error");
        }
    };

    const totalVendors = users.filter((u) => u.role === "vendor").length;
    const fraudVendors = users.filter((u) => u.isFraud).length;

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[var(--surface-canvas)] md:flex-row">
            <Sidebar role="admin" activeId="manage-users" />
            <main className="min-w-0 flex-1 p-5 pb-24 text-slate-100 sm:p-8 lg:p-10 md:pb-10">
                <div className="mx-auto max-w-6xl">
                    {/* Metrics Row */}
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-hairline/8 bg-[var(--surface)] p-4">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                                Total Platform Users
                            </span>
                            <p className="mt-1 font-serif text-2xl text-teal-400">{users.length}</p>
                        </div>
                        <div className="rounded-xl border border-hairline/8 bg-[var(--surface)] p-4">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                                Active Vendors
                            </span>
                            <p className="mt-1 font-serif text-2xl text-blue-400">{totalVendors}</p>
                        </div>
                        <div className="rounded-xl border border-hairline/8 bg-[var(--surface)] p-4">
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
                            <span className={`rounded-lg border px-3 py-1.5 text-xs animate-fade-in ${
                                    statusTone === "error"
                                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                }`}>
                                {statusMessage}
                            </span>
                        )}
                    </header>

                    {/* Filters */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email"
                            aria-label="Search users"
                            className="min-w-0 flex-1 rounded-lg border border-hairline/10 bg-[var(--surface)] px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-[var(--accent-ink)] focus:outline-none"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            aria-label="Filter by role"
                            className="rounded-lg border border-hairline/10 bg-[var(--surface)] px-3 py-2 text-xs text-slate-300 focus:border-[var(--accent-ink)] focus:outline-none"
                        >
                            <option value="">All roles</option>
                            <option value="user">Travellers</option>
                            <option value="vendor">Vendors</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    {isLoading ? (
                        <p className="mt-4 rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            Loading users…
                        </p>
                    ) : loadError ? (
                        <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-10 text-center text-xs text-red-300">
                            {loadError}
                        </p>
                    ) : users.length === 0 ? (
                        <p className="mt-4 rounded-xl border border-hairline/8 bg-[var(--surface)] px-4 py-10 text-center text-xs text-slate-500">
                            No users match this filter.
                        </p>
                    ) : (
                    <div className="mt-4 overflow-x-auto rounded-xl border border-hairline/8 bg-[var(--surface)]">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-hairline/8 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
                                    <th className="px-4 py-3.5">User</th>
                                    <th className="px-4 py-3.5">Role</th>
                                    <th className="px-4 py-3.5">Fraud Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/5 text-xs">
                                {users.map((u) => {
                                    const isVendor = u.role === "vendor";
                                    return (
                                        <tr
                                            key={u._id}
                                            className={`transition-colors hover:bg-hairline/[0.02] ${
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
                                                            onClick={() => handleFraudToggle(u)}
                                                            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-medium transition ${
                                                                u.isFraud
                                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                                                    : "border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                                                            }`}
                                                        >
                                                            {u.isFraud ? (
                                                                <><UserCheck2 className="h-3 w-3" /> Reinstate</>
                                                            ) : (
                                                                <><AlertTriangle className="h-3 w-3 text-rose-400" /> Mark as Fraud</>
                                                            )}
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
                    )}
                </div>
            </main>
        </div>
    );
}
