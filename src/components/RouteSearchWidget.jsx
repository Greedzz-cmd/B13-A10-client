"use client";

import { Button, Input, ListBox, Select, Tabs } from "@heroui/react";
import { BusFront, PlaneTakeoff, Ship, TramFront } from "lucide-react";
import { useState } from "react";

function SearchIcon() {
    return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
    );
}

function SwapIcon() {
    return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <path
                d="M5 8h13m-3-3 3 3-3 3M19 16H6m3-3-3 3 3 3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
            />
        </svg>
    );
}

const locations = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Cox's Bazar"];
const modes = [
    ["flight", "Flight", PlaneTakeoff],
    ["train", "Train", TramFront],
    ["bus", "Bus", BusFront],
    ["launch", "Launch", Ship],
];

export default function RouteSearchWidget() {
    const [transport, setTransport] = useState("flight");
    const [from, setFrom] = useState("Dhaka");
    const [to, setTo] = useState("Chittagong");
    const [date, setDate] = useState("");
    const [seats, setSeats] = useState("1");

    return (
        <div
            id="routes"
            className="relative mx-auto mt-24 max-w-[790px] overflow-hidden rounded-lg border border-white/10 bg-[#141f35] shadow-2xl shadow-black/20 sm:mt-28"
        >
            {/* Selectable transport modes. */}
            <Tabs
                selectedKey={transport}
                onSelectionChange={key => setTransport(String(key))}
                className="w-full border-b border-white/10"
                variant="underlined"
            >
                <Tabs.List aria-label="Transport mode" className="grid h-10 w-full grid-cols-4 bg-[#192236]">
                    {modes.map(([id, label, Icon]) => (
                        <Tabs.Tab
                            key={id}
                            id={id}
                            className="cursor-pointer justify-center rounded-none border-b-2 border-transparent px-2 text-[10px] text-slate-400 transition-colors hover:bg-white/5 hover:text-white data-[selected=true]:border-[#dd7845] data-[selected=true]:bg-[#20283a] data-[selected=true]:text-[#dd7845]"
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
                                {label}
                            </span>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>
            {/* Route, date, seat, and search controls. */}
            <div className="grid items-end gap-2 bg-[#141f35] p-4 max-md:grid-cols-[1fr_32px_1fr] sm:grid-cols-[1.2fr_32px_1.2fr_1fr_100px_110px]">
                <div className="max-md:col-start-1 max-md:row-start-1">
                    <span className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-slate-500">From</span>
                    <Select
                        aria-label="From"
                        selectedKey={from}
                        onSelectionChange={key => setFrom(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger className="h-10 rounded-lg">
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
                </div>
                <div className="flex items-end max-md:col-start-2 max-md:row-start-1">
                    <Button
                        aria-label="Swap departure and destination"
                        onPress={() => {
                            setFrom(to);
                            setTo(from);
                        }}
                        className="h-10 w-full rounded-lg border border-[#2b3a52] bg-[#172238] p-0 text-slate-300 hover:border-[#dd7845] hover:text-[#dd7845] sm:mb-0"
                        size="sm"
                        variant="secondary"
                    >
                        <SwapIcon />
                    </Button>
                </div>
                <div className="max-md:col-start-3 max-md:row-start-1">
                    <span className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-slate-500">To</span>
                    <Select
                        aria-label="To"
                        selectedKey={to}
                        onSelectionChange={key => setTo(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger className="h-10 rounded-lg">
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
                </div>
                <div className="max-md:col-start-1 max-md:col-span-3">
                    <span className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-slate-500">Date</span>
                    <Input
                        aria-label="Date"
                        type="date"
                        value={date}
                        onChange={event => setDate(event.target.value)}
                        size="sm"
                        variant="secondary"
                        className="h-10 w-full rounded-lg [&_input]:h-10 [&_input]:w-full [&_input]:rounded-lg"
                    />
                </div>
                <div className="max-md:col-start-1 max-md:col-span-3">
                    <span className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-slate-500">Seats</span>
                    <Select
                        aria-label="Seats"
                        selectedKey={seats}
                        onSelectionChange={key => setSeats(String(key))}
                        size="sm"
                        variant="secondary"
                    >
                        <Select.Trigger className="h-10 rounded-lg">
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
                </div>
                <Button
                    onPress={() => window.alert(`${transport}: ${from} to ${to}`)}
                    className="h-10 rounded-lg bg-[#dd7845] pt-2 text-[11px] text-white hover:bg-[#ef8a53] max-md:col-start-1 max-md:col-span-3"
                    size="sm"
                >
                    <SearchIcon /> Search
                </Button>
            </div>
        </div>
    );
}
