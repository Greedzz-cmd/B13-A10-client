"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const initialForm = {
    title: "",
    from: "",
    to: "",
    price: "",
    quantity: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    image: "",
    transportType: "Bus",
    fareClass: "Economy",
    perks: [],
};

const perkOptions = [
    "AC",
    "WiFi",
    "Meal",
    "Breakfast",
    "Dinner",
    "USB Charging",
    "Blanket",
    "Priority Boarding",
    "Extra Legroom",
    "Reclining Seats",
    "Deck View",
    "Private Cabin",
    "Lounge Access",
    "Window Seat",
    "Charging Ports",
    "Pantry Car",
];

function Field({ label, name, value, onChange, type = "text", placeholder, required = false, step }) {
    return (
        <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {label}{required && <span className="text-blue-400"> *</span>}
            </span>
            <input
                required={required}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                step={step}
                className="h-11 w-full rounded-lg border border-[#26344b] bg-[#111c2e] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
            />
        </label>
    );
}

export default function AddTicketPage() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(event) {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    }

    function togglePerk(perk) {
        setForm(current => ({
            ...current,
            perks: current.perks.includes(perk)
                ? current.perks.filter(item => item !== perk)
                : [...current.perks, perk],
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        const departureDateTime = `${form.departureDate}T${form.departureTime}`;
        const arrivalDateTime = `${form.departureDate}T${form.arrivalTime}`;
        const payload = {
            title: form.title,
            from: form.from,
            to: form.to,
            price: Number(form.price),
            quantity: Number(form.quantity),
            totalSeats: Number(form.quantity),
            departureDateTime,
            arrivalDateTime,
            duration: form.duration,
            image: form.image,
            transportType: form.transportType,
            fareClass: form.fareClass,
            perks: form.perks,
            vendorName: "Nusrat Jahan",
            vendorEmail: "nusrat@example.com",
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("The ticket could not be submitted.");
            }

            setForm(initialForm);
            setStatus({ type: "success", message: "Ticket submitted for admin approval." });
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Something went wrong. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-[#080f1d] md:flex-row">
            <Sidebar role="vendor" />
            <main className="min-w-0 flex-1 p-5 text-slate-100 sm:p-8 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-7">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-400">Vendor workspace</p>
                        <h1 className="mt-2 font-serif text-4xl font-medium tracking-[-0.04em] text-slate-100">Add Ticket</h1>
                        <p className="mt-2 text-sm text-slate-400">Submit a new ticket for admin approval.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#1e2a3c] bg-[#111a2b] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:p-7">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Ticket title (operator)" name="title" value={form.title} onChange={updateField} placeholder="e.g. Greenline Express" required />
                            <Field label="From (location)" name="from" value={form.from} onChange={updateField} placeholder="e.g. Dhaka" required />
                            <Field label="To (location)" name="to" value={form.to} onChange={updateField} placeholder="e.g. Sylhet" required />
                            <Field label="Price per seat (BDT)" name="price" value={form.price} onChange={updateField} type="number" min="0" placeholder="e.g. 1200" required />
                            <Field label="Ticket quantity (seats)" name="quantity" value={form.quantity} onChange={updateField} type="number" min="1" placeholder="e.g. 44" required />
                            <Field label="Departure date" name="departureDate" value={form.departureDate} onChange={updateField} type="date" required />
                            <Field label="Departure time" name="departureTime" value={form.departureTime} onChange={updateField} type="time" required />
                            <Field label="Arrival time" name="arrivalTime" value={form.arrivalTime} onChange={updateField} type="time" required />
                            <Field label="Duration" name="duration" value={form.duration} onChange={updateField} placeholder="e.g. 6h 30m" />
                        </div>

                        <div className="mt-5">
                            <Field label="Image URL (optional)" name="image" value={form.image} onChange={updateField} type="url" placeholder="https://..." />
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <label>
                                <span className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Transport type</span>
                                <select name="transportType" value={form.transportType} onChange={updateField} className="h-11 w-full rounded-lg border border-[#26344b] bg-[#111c2e] px-3 text-sm text-slate-100 outline-none focus:border-blue-500/70">
                                    {['Bus', 'Train', 'Flight', 'Launch'].map(type => <option key={type}>{type}</option>)}
                                </select>
                            </label>
                            <label>
                                <span className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Class</span>
                                <select name="fareClass" value={form.fareClass} onChange={updateField} className="h-11 w-full rounded-lg border border-[#26344b] bg-[#111c2e] px-3 text-sm text-slate-100 outline-none focus:border-blue-500/70">
                                    {['Economy', 'Business', 'First'].map(type => <option key={type}>{type}</option>)}
                                </select>
                            </label>
                        </div>

                        <fieldset className="mt-6">
                            <legend className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Perks <span className="font-sans normal-case tracking-normal text-slate-600">(select all that apply)</span></legend>
                            <div className="flex flex-wrap gap-x-4 gap-y-3">
                                {perkOptions.map(perk => (
                                    <label key={perk} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                                        <input type="checkbox" checked={form.perks.includes(perk)} onChange={() => togglePerk(perk)} className="h-3.5 w-3.5 rounded border-[#34445b] bg-[#111c2e] accent-blue-500" />
                                        {perk}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="mt-6 grid gap-5 border-t border-white/6 pt-5 md:grid-cols-2">
                            <Field label="Vendor name (readonly)" name="vendorName" value="Nusrat Jahan" onChange={() => {}} />
                            <Field label="Vendor email (readonly)" name="vendorEmail" value="nusrat@example.com" onChange={() => {}} type="email" />
                        </div>

                        {status.message && <output className={`mt-5 block rounded-lg border px-3 py-2.5 text-sm ${status.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>{status.message}</output>}

                        <button type="submit" disabled={isSubmitting} className="mt-6 h-12 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? "Submitting..." : "Add Ticket"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}