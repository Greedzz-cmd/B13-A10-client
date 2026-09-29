"use client";

import { useCallback, useEffect, useState } from "react";
import { authenticatedFetch, patchTicket } from "@/lib/api-client";
import VendorTicketCard from "@/components/VendorTicketCard";

function toDateTimeLocal(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function VendorTicketGrid() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [deleteErrors, setDeleteErrors] = useState({});
    const [editingTicket, setEditingTicket] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [editError, setEditError] = useState("");
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // This page is scoped to the signed-in vendor, so it must read /tickets/me.
    // The public catalogue endpoint returns every approved ticket regardless of
    // who submitted it, which is not what "My Added Tickets" means.
    const fetchTickets = useCallback(async () => {
        const response = await authenticatedFetch("/tickets/me?limit=100&sort=newest");
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `Could not load your tickets (HTTP ${response.status}).`);
        }

        return data?.tickets || [];
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetchTickets()
            .then(rows => {
                if (!cancelled) setTickets(rows);
            })
            .catch(error => {
                if (!cancelled) setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fetchTickets]);

    function openEdit(ticket) {
        setEditingTicket(ticket);
        setEditError("");
        setEditForm({
            title: ticket.title || "",
            from: ticket.from || "",
            to: ticket.to || "",
            price: ticket.price ?? "",
            quantity: ticket.quantity ?? ticket.totalSeats ?? "",
            departureDateTime: toDateTimeLocal(ticket.departureDateTime),
            arrivalDateTime: toDateTimeLocal(ticket.arrivalDateTime),
            duration: ticket.duration || "",
            transportType: ticket.transportType || "Bus",
            fareClass: ticket.fareClass || "Economy",
        });
    }

    function closeEdit() {
        if (isSavingEdit) return;
        setEditingTicket(null);
        setEditForm(null);
        setEditError("");
    }

    async function updateTicket(event) {
        event.preventDefault();
        if (!editingTicket || !editForm || isSavingEdit) return;

        const id = String(editingTicket._id || editingTicket.id);
        const payload = {
            ...editForm,
            price: Number(editForm.price),
            quantity: Number(editForm.quantity),
        };
        setIsSavingEdit(true);
        setEditError("");

        try {
            const response = await patchTicket(id, payload);
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data?.message || data?.error || `Ticket update failed (HTTP ${response.status}).`);
            }

            const updated = data?.ticket || data?.data || (data?._id || data?.id ? data : {});
            setTickets(current => current.map(ticket =>
                String(ticket._id || ticket.id) === id ? { ...ticket, ...payload, ...updated } : ticket,
            ));
            setEditingTicket(null);
            setEditForm(null);
        } catch (error) {
            setEditError(error instanceof Error ? error.message : "The ticket could not be updated.");
        } finally {
            setIsSavingEdit(false);
        }
    }

    async function deleteTicket(id) {
        if (!id || deletingId) return;
        const ticket = tickets.find(item => String(item._id || item.id) === String(id));
        const route = ticket ? `${ticket.from} to ${ticket.to}` : "this ticket";
        if (!window.confirm(`Delete the ticket from ${route}? This cannot be undone.`)) return;

        const key = String(id);
        setDeletingId(key);
        setDeleteErrors(current => ({ ...current, [key]: "" }));

        try {
            const response = await authenticatedFetch(`/tickets/${encodeURIComponent(key)}`, { method: "DELETE" });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || data.error || `Ticket deletion failed (HTTP ${response.status}).`);
            }
            setTickets(current => current.filter(item => String(item._id || item.id) !== key));
        } catch (error) {
            setDeleteErrors(current => ({
                ...current,
                [key]: error instanceof Error ? error.message : "The ticket could not be deleted.",
            }));
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div>
            {isLoading ? (
                <p className="rounded-xl border border-hairline/10 bg-[var(--surface)] p-6 text-center text-sm text-slate-400">
                    Loading your tickets…
                </p>
            ) : loadError ? (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
                    {loadError}
                </p>
            ) : (
                <>
                    <p className="mb-3 text-xs text-slate-400">
                        {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} · updates go live after admin approval
                    </p>
                    {tickets.length === 0 ? (
                        <p className="rounded-xl border border-hairline/10 bg-[var(--surface)] p-6 text-sm text-slate-400">
                            You haven’t added any tickets yet.
                        </p>
                    ) : (
                        <section aria-label="Added tickets" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {tickets.map(ticket => {
                                const id = String(ticket._id || ticket.id);
                                return (
                                    <VendorTicketCard
                                        key={id}
                                        ticket={ticket}
                                        onEdit={openEdit}
                                        onDelete={deleteTicket}
                                        isDeleting={deletingId === id}
                                        deleteError={deleteErrors[id]}
                                    />
                                );
                            })}
                        </section>
                    )}
                </>
            )}

            {editingTicket && editForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-shade/70 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="edit-ticket-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-hairline/10 bg-[var(--surface)] p-5 text-slate-100 shadow-2xl sm:p-7">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 id="edit-ticket-title" className="font-serif text-2xl">Update ticket</h2>
                                <p className="mt-1 text-xs text-slate-400">Save changes to this ticket.</p>
                            </div>
                            <button type="button" onClick={closeEdit} disabled={isSavingEdit} aria-label="Close edit form" className="rounded-md px-2 py-1 text-slate-400 hover:bg-hairline/10 hover:text-white disabled:opacity-50">×</button>
                        </div>
                        <form onSubmit={updateTicket} className="grid gap-4 sm:grid-cols-2">
                            {[
                                ["title", "Operator / ticket title", "text"],
                                ["from", "From", "text"],
                                ["to", "To", "text"],
                                ["price", "Price per seat", "number"],
                                ["quantity", "Available seats", "number"],
                                ["departureDateTime", "Departure", "datetime-local"],
                                ["arrivalDateTime", "Arrival", "datetime-local"],
                                ["duration", "Duration", "text"],
                            ].map(([name, label, type]) => (
                                <label key={name} className="grid gap-1.5 text-xs text-slate-400">
                                    {label}
                                    <input
                                        name={name}
                                        type={type}
                                        value={editForm[name]}
                                        onChange={event => setEditForm(current => ({ ...current, [name]: event.target.value }))}
                                        required={name !== "duration"}
                                        min={type === "number" ? "0" : undefined}
                                        step={name === "price" ? "0.01" : undefined}
                                        className="h-10 rounded-lg border border-hairline/10 bg-[var(--surface-canvas)] px-3 text-sm text-slate-100 outline-none focus:border-brand"
                                    />
                                </label>
                            ))}
                            <label className="grid gap-1.5 text-xs text-slate-400">
                                Transport type
                                <select value={editForm.transportType} onChange={event => setEditForm(current => ({ ...current, transportType: event.target.value }))} className="h-10 rounded-lg border border-hairline/10 bg-[var(--surface-canvas)] px-3 text-sm text-slate-100">
                                    {["Bus", "Train", "Flight", "Launch"].map(value => <option key={value}>{value}</option>)}
                                </select>
                            </label>
                            <label className="grid gap-1.5 text-xs text-slate-400">
                                Class
                                <select value={editForm.fareClass} onChange={event => setEditForm(current => ({ ...current, fareClass: event.target.value }))} className="h-10 rounded-lg border border-hairline/10 bg-[var(--surface-canvas)] px-3 text-sm text-slate-100">
                                    {["Economy", "Business", "First"].map(value => <option key={value}>{value}</option>)}
                                </select>
                            </label>
                            {editError && <p role="alert" className="text-sm text-red-400 sm:col-span-2">{editError}</p>}
                            <div className="flex justify-end gap-2 sm:col-span-2">
                                <button type="button" onClick={closeEdit} disabled={isSavingEdit} className="rounded-lg border border-hairline/10 px-4 py-2 text-sm text-slate-300 hover:bg-hairline/5 disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={isSavingEdit} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-wait disabled:opacity-50">
                                    {isSavingEdit ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
