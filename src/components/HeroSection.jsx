"use client";

import { Button, Input, ListBox, Select, Tabs } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

function RouteMap() {
    return (
        <div className="relative h-[320px] w-full max-w-[500px] opacity-80 sm:h-[370px]" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 370" fill="none">
                <g stroke="#c96d40" strokeDasharray="4 6" strokeOpacity="0.42">
                    <path d="M254 180C198 156 166 144 95 133" />
                    <path d="M254 180C212 212 164 246 108 274" />
                    <path d="M254 180C310 143 352 113 432 90" />
                    <path d="M254 180C300 179 359 193 410 235" />
                    <path d="M254 180C311 208 373 265 444 306" />
                    <path d="M254 180C233 122 219 78 195 42" />
                </g>
                <g fill="#dd7845" fillOpacity="0.9" stroke="#f3a06f" strokeOpacity="0.35">
                    <circle cx="254" cy="180" r="6" />
                    <circle cx="95" cy="133" r="4" />
                    <circle cx="108" cy="274" r="4" />
                    <circle cx="432" cy="90" r="4" />
                    <circle cx="410" cy="235" r="4" />
                    <circle cx="444" cy="306" r="4" />
                    <circle cx="195" cy="42" r="4" />
                </g>
            </svg>
            <span className="absolute left-[50%] top-[47%] text-[9px] text-slate-400">DAC</span>
            <span className="absolute left-[37%] top-[12%] text-[9px] text-slate-500">RGP</span>
            <span className="absolute left-[16%] top-[39%] text-[9px] text-slate-500">RSH</span>
            <span className="absolute left-[18%] top-[76%] text-[9px] text-slate-500">KHL</span>
            <span className="absolute right-[7%] top-[22%] text-[9px] text-slate-500">ZYL</span>
            <span className="absolute right-[12%] top-[59%] text-[9px] text-slate-500">CGP</span>
            <span className="absolute right-[3%] bottom-[10%] text-[9px] text-slate-500">CXB</span>
        </div>
    );
}

function SearchIcon() {
    return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
    );
}

export default function HeroSection() {
    const [transport, setTransport] = useState("flight");
    const [from, setFrom] = useState("Dhaka");
    const [to, setTo] = useState("Chittagong");
    const [date, setDate] = useState("");
    const [seats, setSeats] = useState("1");

    const locations = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Cox's Bazar"];
    const modes = [
        ["flight", "✈ Flight"],
        ["train", "▣ Train"],
        ["bus", "▧ Bus"],
        ["launch", "♧ Launch"],
    ];

    return (
        <section className="relative mx-auto min-h-[calc(100vh-60px)] max-w-[1280px] px-6 pb-8 pt-16 sm:px-10 sm:pt-20 lg:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_42%,rgba(51,67,97,0.16),transparent_32%),linear-gradient(180deg,rgba(8,15,29,0),rgba(8,15,29,0.65))]" />
            <div className="relative grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
                <div className="relative z-10 max-w-[510px]">
                    <p className="mb-7 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#dd7845]">
                        <span className="h-px w-2 bg-[#dd7845]" /> Bangladesh&apos;s premium travel platform{" "}
                        <span className="h-px w-2 bg-[#dd7845]" />
                    </p>
                    <h1 className="font-serif text-[46px] leading-[1.02] tracking-normal text-slate-100 sm:text-[54px]">
                        Your route.
                        <br />
                        Your time.
                        <br />
                        <span className="text-[#e27b45]">Your journey.</span>
                    </h1>
                    <p className="mt-5 max-w-[390px] text-[13px] leading-5 text-slate-400">
                        Book buses, trains, launches and flights across Bangladesh. Seamlessly. Elegantly. All in one
                        place.
                    </p>
                    <div className="mt-7 flex items-center gap-3">
                        <Link
                            className="rounded-[5px] bg-[#dd7845] px-5 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-[#ef8a53]"
                            href="#/all-tickets"
                        >
                            Explore routes <span className="ml-2">→</span>
                        </Link>
                        <Link
                            className="text-[10px] text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white"
                            href="/get-started"
                        >
                            Create account — it&apos;s free
                        </Link>
                    </div>
                    <div className="mt-10 grid max-w-[430px] grid-cols-3 border-t border-white/10 pt-5">
                        <div>
                            <p className="font-serif text-[16px] text-slate-200">9,200+</p>
                            <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">TRAVELERS MONTHLY</p>
                        </div>
                        <div>
                            <p className="font-serif text-[16px] text-slate-200">45</p>
                            <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">ROUTES COVERED</p>
                        </div>
                        <div>
                            <p className="font-serif text-[16px] text-slate-200">4</p>
                            <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">TRANSPORT MODES</p>
                        </div>
                    </div>
                </div>
                <div className="absolute right-[-7%] top-[220px] z-0 w-[125%] opacity-45 md:right-0 md:flex md:w-full md:justify-end lg:relative lg:right-auto lg:top-auto lg:w-auto lg:justify-center lg:pt-2 lg:opacity-80">
                    <RouteMap />
                </div>
            </div>
            <div
                id="routes"
                className="relative mx-auto mt-24 max-w-[790px] overflow-hidden rounded-[7px] border border-white/10 bg-[#141f35] shadow-2xl shadow-black/20 sm:mt-28"
            >
                <Tabs
                    selectedKey={transport}
                    onSelectionChange={key => setTransport(String(key))}
                    className="w-full"
                    variant="underlined"
                >
                    <Tabs.List aria-label="Transport mode" className="grid w-full grid-cols-4 border-b border-white/10">
                        {modes.map(([id, label]) => (
                            <Tabs.Tab key={id} id={id} className="justify-center text-[10px] text-slate-400">
                                {label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>
                <div className="grid gap-2 p-3 sm:grid-cols-[1.2fr_1.2fr_1fr_72px_80px] sm:items-end">
                    <Select
                        aria-label="From"
                        label="FROM"
                        selectedKey={from}
                        onSelectionChange={key => setFrom(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox className="text-black">
                                {locations.map(location => (
                                    <ListBox.Item key={location} id={location} className="text-black">
                                        {location}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select
                        aria-label="To"
                        label="TO"
                        selectedKey={to}
                        onSelectionChange={key => setTo(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox className="text-black">
                                {locations.map(location => (
                                    <ListBox.Item key={location} id={location} className="text-black">
                                        {location}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Input
                        aria-label="Date"
                        label="DATE"
                        type="date"
                        value={date}
                        onChange={event => setDate(event.target.value)}
                        size="sm"
                        variant="secondary"
                    />
                    <Select
                        aria-label="Seats"
                        label="SEATS"
                        selectedKey={seats}
                        onSelectionChange={key => setSeats(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox className="text-black">
                                {[1, 2, 3, 4, 5, 6].map(count => (
                                    <ListBox.Item key={count} id={String(count)} className="text-black">
                                        {count}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Button
                        onPress={() => window.alert(`${transport}: ${from} to ${to}`)}
                        className="h-8 bg-[#dd7845] text-[11px] text-white hover:bg-[#ef8a53]"
                        size="sm"
                    >
                        <SearchIcon /> Search
                    </Button>
                </div>
            </div>
        </section>
    );
}
