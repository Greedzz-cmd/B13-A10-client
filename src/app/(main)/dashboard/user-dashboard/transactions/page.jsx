"use client";

import React, { useState } from "react";
import { Receipt, Download, ExternalLink } from "lucide-react";

const TRANSACTIONS = [
    {
        id: "txn_a1b2c3d4",
        ticketTitle: "Dhaka → Sylhet (Train)",
        amount: "৳850",
        numericAmount: 850,
        paymentDate: "2026-08-18",
        status: "Succeeded",
        cardLast4: "4242",
        receiptUrl: "#",
    },
];

export default function TransactionHistoryPage() {
    const [selectedTxn, setSelectedTxn] = useState(null);

    const totalPaid = TRANSACTIONS.reduce((acc, curr) => acc + curr.numericAmount, 0);

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-7">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                    Transaction History
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                    All your Stripe payment records.
                </p>
            </div>

            {/* Transactions Card Table */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0e172a] shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                                <th scope="col" className="px-6 py-4">TRANSACTION ID</th>
                                <th scope="col" className="px-6 py-4">TICKET TITLE</th>
                                <th scope="col" className="px-6 py-4">AMOUNT</th>
                                <th scope="col" className="px-6 py-4">PAYMENT DATE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {TRANSACTIONS.map((txn) => (
                                <tr
                                    key={txn.id}
                                    className="transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* Transaction ID */}
                                    <td className="px-6 py-4.5 font-mono text-slate-400">
                                        {txn.id}
                                    </td>

                                    {/* Ticket Title */}
                                    <td className="px-6 py-4.5 font-medium text-slate-200">
                                        {txn.ticketTitle}
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4.5 font-semibold text-[#f48a52]">
                                        {txn.amount}
                                    </td>

                                    {/* Payment Date */}
                                    <td className="px-6 py-4.5 text-slate-400">
                                        {txn.paymentDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-6 py-4 text-xs">
                    <span className="text-slate-400">
                        {TRANSACTIONS.length} transaction{TRANSACTIONS.length > 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold text-slate-100">
                        Total: ৳{totalPaid.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
