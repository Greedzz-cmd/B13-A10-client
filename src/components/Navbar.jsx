"use client";

import Link from "next/link";
import { useState } from "react";
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

const maxWidthClasses = {
    sm: "max-w-[640px]",
    md: "max-w-[768px]",
    lg: "max-w-[1024px]",
    xl: "max-w-[1280px]",
    "2xl": "max-w-[1536px]",
    full: "max-w-full",
};

const defaultItems = [
    { href: "#tickets", label: "All Tickets", isActive: true },
    { href: "#trips", label: "My Trips" },
    { href: "#vendors", label: "Vendors" },
    { href: "#admin", label: "Admin" },
];

function BusIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
                d="M5 17V6.5C5 4.57 6.57 3 8.5 3h7C17.43 3 19 4.57 19 6.5V17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
            />
            <path
                d="M5 10h14M7 17h10M7 20h.01M17 20h.01M7 17v3M17 17v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
            />
            <path d="M7 7h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
    );
}

function DefaultBrand() {
    return (
        <Link className="flex items-center gap-2 text-[13px] tracking-[0.01em] text-slate-200" href="/">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[#dd7845] text-white">
                <BusIcon />
            </span>
            <span>ticket bari</span>
        </Link>
    );
}

function DefaultRightContent() {
    return (
        <>
            <button
                className="text-slate-400 transition-colors hover:text-white"
                type="button"
                aria-label="Change theme"
            >
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                    />
                </svg>
            </button>
            <a className="text-[11px] text-slate-300 transition-colors hover:text-white" href="#sign-in">
                Sign in
            </a>
            <a
                className="rounded-[5px] bg-[#dd7845] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#ee8954]"
                href="#get-started"
            >
                Get started
            </a>
        </>
    );
}

export function Navbar({
    brand = <DefaultBrand />,
    items = defaultItems,
    rightContent = <DefaultRightContent />,
    className,
    maxWidth = "full",
    position = "sticky",
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav
            className={cn(
                "z-40 w-full border-b border-white/5 bg-[#0a1121] text-slate-100",
                position === "sticky" && "sticky top-0",
                position === "fixed" && "fixed top-0",
                className,
            )}
        >
            <header
                className={cn(
                    "mx-auto flex h-[60px] w-full items-center justify-between px-5 sm:px-7",
                    maxWidth !== "full" && maxWidthClasses[maxWidth],
                )}
            >
                <div className="flex items-center gap-3">
                    <button
                        className="rounded p-1 text-slate-300 transition-colors hover:bg-white/10 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        type="button"
                    >
                        <span className="sr-only">Menu</span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                    {brand}
                </div>
                <ul className="hidden items-center gap-4 md:flex">
                    {items.map(item => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={cn(
                                    "text-sm text-slate-400 transition-colors hover:text-white",
                                    item.isActive && "text-slate-100",
                                )}
                                aria-current={item.isActive ? "page" : undefined}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                {rightContent && <div className="hidden items-center gap-4 md:flex">{rightContent}</div>}
            </header>
            {isMenuOpen && (
                <div className="border-t border-white/10 bg-[#0a1121] md:hidden">
                    <ul className="flex flex-col gap-2 p-4">
                        {items.map(item => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={cn(
                                        "block py-2 text-sm text-slate-400 transition-colors hover:text-white",
                                        item.isActive && "font-medium text-slate-100",
                                    )}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        {rightContent && (
                            <li className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">{rightContent}</li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
