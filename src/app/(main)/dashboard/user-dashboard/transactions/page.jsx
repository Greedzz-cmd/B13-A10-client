"use client";

import { Receipt, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api-client";

const CURRENCY_LABELS = { bdt: "৳", usd: "$", eur: "€", gbp: "£" };

const formatAmount = (amount, currency = "bdt") => {
    const value = Number(amount) || 0;
    const symbol = CURRENCY_LABELS[String(currency).toLowerCase()] || "";

    return `${symbol}${value.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function TransactionHistoryPage() {
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const isSessionPending = session?.isPending ?? true;

    const [transactions, setTransactions] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userEmail) return undefined;

        const controller = new AbortController();

        authenticatedFetch("/transactions", { signal: controller.signal })
            .then(async (response) => {
                const data = response.ok ? await response.json() : null;

                if (!response.ok) {
                    throw new Error(data?.message || "Could not load your transactions.");
                }

                return data;
            })
            .then((data) => {
                setTransactions(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch((loadError) => {
                if (loadError.name === "AbortError") return;
                setTransactions([]);
                setError(loadError.message);
            });

        return () => controller.abort();
    }, [userEmail]);

    if (!isSessionPending && !userEmail) {
        return (
            <div className="max-w-6xl">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                    Transaction History
                </h1>
                <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-950/25 p-3 text-xs text-amber-300">
                    Sign in to see your payment records.
                </p>
            </div>
        );
    }

    const isLoading = transactions === null;
    const totalPaid = (transactions || []).reduce(
        (sum, transaction) => sum + (Number(transaction.amount) || 0),
        0
    );

    return (
        <div className="max-w-6xl">
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                        Transaction History
                    </h1>
                    <p className="mt-1 text-xs text-slate-400">
                        {isLoading
                            ? "Loading…"
                            : `Every completed payment on your account${
                                  transactions.length === 1 ? "" : "s"
                              }.`}
                    </p>
                </div>
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />}
            </div>

            {error && (
                <p
                    role="alert"
                    className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-950/25 p-3 text-xs text-rose-300"
                >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}

            {isLoading ? (
                <div
                    className="h-64 animate-pulse rounded-2xl border border-hairline/5 bg-[var(--surface-inset)]"
                    aria-busy="true"
                />
            ) : transactions.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-hairline/5 bg-[var(--surface-inset)] shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-hairline/5 bg-shade/20 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                                    <th scope="col" className="px-6 py-4">Transaction</th>
                                    <th scope="col" className="px-6 py-4">Ticket</th>
                                    <th scope="col" className="px-6 py-4">Seats</th>
                                    <th scope="col" className="px-6 py-4">Amount</th>
                                    <th scope="col" className="px-6 py-4">Paid at</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/5 text-xs">
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction.id || transaction._id}
                                        className="transition-colors hover:bg-hairline/[0.02]"
                                    >
                                        <td className="px-6 py-4.5 font-mono text-[11px] text-slate-400">
                                            <span className="block">{transaction.transactionId || "—"}</span>
                                            <span className="mt-0.5 block font-sans text-[10px] uppercase tracking-wider text-slate-500">
                                                {transaction.provider}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4.5 font-medium text-slate-200">
                                            <span className="block">{transaction.ticketTitle || "Ticket"}</span>
                                            {transaction.pnr && (
                                                <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                                                    PNR {transaction.pnr}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4.5 text-slate-400">{transaction.quantity ?? 1}</td>

                                        <td className="px-6 py-4.5 font-semibold text-[var(--accent-ink)]">
                                            {formatAmount(transaction.amount, transaction.currency)}
                                        </td>

                                        <td className="px-6 py-4.5 text-slate-400">
                                            {formatDate(transaction.paidAt || transaction.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline/5 bg-shade/30 px-6 py-4 text-xs">
                        <span className="text-slate-400">
                            {transactions.length} transaction{transactions.length > 1 ? "s" : ""}
                        </span>
                        <span className="font-semibold text-slate-100">
                            Total: {formatAmount(totalPaid, transactions[0]?.currency)}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-hairline/10 p-12 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-[var(--accent-ink)]">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <p className="mt-4 flex items-center justify-center gap-2 text-base font-medium text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        No payments yet
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">
                        Once a booking is accepted and paid for, the receipt appears here.
                    </p>
                </div>
            )}
        </div>
    );
}
