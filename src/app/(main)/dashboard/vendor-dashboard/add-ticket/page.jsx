"use client";

import { useState } from "react";
import { Button, Checkbox, Input, ListBox, ListBoxItem, Select } from "@heroui/react";
import { Sidebar } from "@/components/Sidebar";
import { useSession } from "@/lib/auth-client";

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

const transportOptions = ["Bus", "Train", "Flight", "Launch"];
const classOptions = ["Economy", "Business", "First"];

function Field({ label, name, value, onChange, type = "text", placeholder, required = false, step, min, readOnly = false }) {
    return (
        <div>
            <label htmlFor={name} className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500">
                {label}{required && <span className="text-primary"> *</span>}
            </label>
            <Input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                step={step}
                min={min}
                readOnly={readOnly}
                variant="bordered"
                radius="lg"
                className="w-full placeholder:text-default-500"
            />
        </div>
    );
}

export default function AddTicketPage() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const data = useSession();
    function updateField(event) {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    }

    function updateSelect(name, value) {
        setForm(current => ({ ...current, [name]: value ?? "" }));
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
            vendorName: data.data.user.name,
            vendorEmail: data.data.user.email,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("The ticket could not be submitted.");

            setForm(initialForm);
            setStatus({ type: "success", message: "Ticket submitted for admin approval." });
        } catch (error) {
            setStatus({ type: "error", message: error instanceof Error ? error.message : "Something went wrong. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col bg-background md:flex-row">
            <Sidebar role="vendor" />
            <main className="min-w-0 flex-1 p-5 text-foreground sm:p-8 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-7">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Vendor workspace</p>
                        <h1 className="mt-2 font-serif text-4xl font-medium tracking-[-0.04em]">Add Ticket</h1>
                        <p className="mt-2 text-sm text-default-500">Submit a new ticket for admin approval.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-2xl sm:p-7">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Select
                                aria-label="Transport type"
                                label="Transport type"
                                selectedKey={form.transportType}
                                onSelectionChange={key => updateSelect("transportType", key?.toString() ?? null)}
                                variant="bordered"
                                radius="lg"
                                className="w-full text-black"
                                classNames={{ trigger: "border-default-200 bg-content1", label: "text-default-500" }}
                            >
                                <Select.Trigger><Select.Value /></Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {transportOptions.map(option => <ListBoxItem key={option} id={option}>{option}</ListBoxItem>)}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                            <Select
                                aria-label="Class"
                                label="Class"
                                selectedKey={form.fareClass}
                                onSelectionChange={key => updateSelect("fareClass", key?.toString() ?? null)}
                                variant="bordered"
                                radius="lg"
                                className="w-full text-black"
                                classNames={{ trigger: "border-default-200 bg-content1", label: "text-default-500" }}
                            >
                                <Select.Trigger><Select.Value /></Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {classOptions.map(option => <ListBoxItem key={option} id={option}>{option}</ListBoxItem>)}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        <fieldset className="mt-6">
                            <legend className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500">
                                Perks <span className="font-sans normal-case tracking-normal text-default-500">(select all that apply)</span>
                            </legend>
                            <div className="flex flex-wrap gap-2">
                                {perkOptions.map(perk => (
                                    <Checkbox
                                        key={perk}
                                        isSelected={form.perks.includes(perk)}
                                        onChange={() => togglePerk(perk)}
                                        className="rounded-full bg-content1 px-3 py-1.5 text-xs text-default-500 transition data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary"
                                    >
                                        <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                                        <Checkbox.Content>{perk}</Checkbox.Content>
                                    </Checkbox>
                                ))}
                            </div>
                        </fieldset>

                        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-default-200 pt-5 md:grid-cols-2 text-default-500">
                            <Field label="Vendor name (readonly)" name="title" value={data?.data?.user?.name} onChange={() => {}} readOnly />
                            <Field label="Vendor email (readonly)" name="title" value={data?.data?.user?.email} onChange={() => {}} type="email" readOnly />
                        </div>

                        {status.message && <output className={`mt-5 block rounded-lg border px-3 py-2.5 text-sm ${status.type === "success" ? "border-success/20 bg-success/10 text-success" : "border-danger/20 bg-danger/10 text-danger"}`}>{status.message}</output>}

                        <Button type="submit" isDisabled={isSubmitting} color="primary" variant="shadow" radius="lg" size="lg" fullWidth className="mt-6 font-bold">
                            {isSubmitting ? "Submitting..." : "Add Ticket"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
