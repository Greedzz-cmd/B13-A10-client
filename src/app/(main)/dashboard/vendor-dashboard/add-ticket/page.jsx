"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, toast } from "@heroui/react";
import { ImagePlus, ShieldAlert, Loader2, Check } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { authenticatedFetch, readJson, uploadImage } from "@/lib/api-client";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadEnabled, setUploadEnabled] = useState(false);
    const [isFraud, setIsFraud] = useState(false);
    const [account, setAccount] = useState({ name: "", email: "" });

    function updateField(event) {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    }

    // A fraud-flagged vendor is hidden from the catalogue but may still submit;
    // say so plainly rather than letting the ticket vanish after approval.
    const loadAccount = useCallback(async () => {
        const res = await authenticatedFetch("/users/me");
        const me = await readJson(res);

        return { name: me?.name || "", email: me?.email || "", isFraud: Boolean(me?.isFraud) };
    }, []);

    const loadUploadAvailability = useCallback(async () => {
        const res = await authenticatedFetch("/uploads/status");
        const info = await readJson(res).catch(() => null);

        return Boolean(info?.enabled);
    }, []);

    useEffect(() => {
        let cancelled = false;

        // Either lookup failing must not block submitting a ticket.
        Promise.allSettled([loadAccount(), loadUploadAvailability()]).then(
            ([account, uploads]) => {
                if (cancelled) return;
                if (account.status === "fulfilled") {
                    setAccount(account.value);
                    setIsFraud(account.value.isFraud);
                }
                if (uploads.status === "fulfilled") setUploadEnabled(uploads.value);
            }
        );

        return () => {
            cancelled = true;
        };
    }, [loadAccount, loadUploadAvailability]);

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

    async function handleImagePicked(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        setIsUploading(true);
        try {
            const { url } = await uploadImage(file);
            setForm(current => ({ ...current, image: url }));
            const toastId = toast.success("Image uploaded", {
                description: "It is attached to this ticket and will appear in the listing.",
                indicator: <ImagePlus className="size-4" />,
                actionProps: {
                    children: "Dismiss",
                    variant: "tertiary",
                    onPress: () => toast.close(toastId),
                },
            });
        } catch (error) {
            toast.danger(error instanceof Error ? error.message : "The image could not be uploaded.", {
                description: "Choose the file again, or submit the ticket without an image.",
                indicator: <ShieldAlert className="size-4" />,
            });
        } finally {
            setIsUploading(false);
            // Let the same file be chosen again after a failure.
            event.target.value = "";
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

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
        };

        try {
            // vendorName and vendorEmail come from the verified token, so they
            // are not sent from the browser.
            const res = await authenticatedFetch("/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            await readJson(res);

            setForm(initialForm);
            const toastId = toast.success("Ticket submitted for approval", {
                description: "An admin will review it shortly. You will be able to edit it once approved.",
                indicator: <Check className="size-4" />,
                actionProps: {
                    children: "Dismiss",
                    variant: "tertiary",
                    onPress: () => toast.close(toastId),
                },
            });
        } catch (error) {
            toast.danger(error instanceof Error ? error.message : "Something went wrong. Please try again.", {
                description: "Your details were kept, so you can submit the ticket again.",
                indicator: <ShieldAlert className="size-4" />,
            });
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

                        {isFraud && (
                            <p className="mt-5 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    Your account is flagged as fraudulent, so your tickets stay hidden from
                                    travellers even after approval. Contact support to have the flag reviewed.
                                </span>
                            </p>
                        )}

                        <div className="mt-5">
                            {uploadEnabled && (
                                <div className="mb-3">
                                    <label
                                        htmlFor="imageUpload"
                                        className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500"
                                    >
                                        Upload image
                                    </label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label
                                            htmlFor="imageUpload"
                                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-default-200 px-3 text-sm text-foreground transition hover:bg-default-100 has-[:disabled]:cursor-wait has-[:disabled]:opacity-50"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <ImagePlus className="h-4 w-4" />
                                            )}
                                            {isUploading ? "Uploading…" : "Choose image"}
                                        </label>
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                            onChange={handleImagePicked}
                                            disabled={isUploading}
                                            className="sr-only"
                                        />
                                        <span className="text-xs text-default-500">PNG, JPEG, WebP, GIF or AVIF, up to 5 MB.</span>
                                    </div>
                                </div>
                            )}
                            <Field label="Image URL (optional)" name="image" value={form.image} onChange={updateField} type="url" placeholder="https://..." />
                            {form.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={form.image}
                                    alt="Ticket preview"
                                    className="mt-3 h-32 w-full rounded-lg object-cover"
                                />
                            )}
                            {!uploadEnabled && (
                                <p className="mt-2 text-xs text-default-500">
                                    Image hosting is not configured on the server, so paste a direct image URL.
                                </p>
                            )}
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="grid gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500">
                                Transport type
                                <select name="transportType" value={form.transportType} onChange={event => updateSelect("transportType", event.target.value)} className="h-11 w-full rounded-lg border border-default-200 bg-content1 px-3 text-sm font-sans normal-case tracking-normal text-foreground">
                                    {transportOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </label>
                            <label className="grid gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500">
                                Class
                                <select name="fareClass" value={form.fareClass} onChange={event => updateSelect("fareClass", event.target.value)} className="h-11 w-full rounded-lg border border-default-200 bg-content1 px-3 text-sm font-sans normal-case tracking-normal text-foreground">
                                    {classOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </label>
                        </div>

                        <fieldset className="mt-6">
                            <legend className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-default-500">
                                Perks <span className="font-sans normal-case tracking-normal text-default-500">(select all that apply)</span>
                            </legend>
                            <div className="flex flex-wrap gap-2">
                                {perkOptions.map(perk => (
                                    <label
                                        key={perk}
                                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-xs normal-case tracking-normal transition ${form.perks.includes(perk) ? "border-primary bg-primary/15 text-primary" : "border-default-200 bg-content1 text-default-500"}`}
                                    >
                                        <input type="checkbox" checked={form.perks.includes(perk)} onChange={() => togglePerk(perk)} className="h-3.5 w-3.5 accent-brand" />
                                        {perk}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-default-200 pt-5 md:grid-cols-2 text-default-500">
                            <Field label="Vendor name (readonly)" name="vendorName" value={account.name} onChange={() => {}} readOnly />
                            <Field label="Vendor email (readonly)" name="vendorEmail" value={account.email} onChange={() => {}} type="email" readOnly />
                        </div>


                        <Button type="submit" isDisabled={isSubmitting} fullWidth className="mt-6 bg-brand font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-hover">
                            {isSubmitting ? "Submitting..." : "Add Ticket"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
