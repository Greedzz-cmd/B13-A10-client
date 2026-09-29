"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/dashboard";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

function cn(...classes) {
    // Combine optional Tailwind class groups for configurable navbar regions.
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
    { href: "/", label: "Home" },
    { href: "/tickets", label: "All Tickets" },
    { href: "/dashboard", label: "Dashboard" },
];

function RouteMark() {
    // Brand route mark.
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
                d="M7 19V5h5.5a4.5 4.5 0 0 1 0 9H7m5.5 0L18 19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function DefaultBrand() {
    // Default navbar brand link.
    return (
        <Link className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.02em] text-slate-100" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand text-white">
                <RouteMark />
            </span>
            <span>Routely</span>
        </Link>
    );
}

function DefaultRightContent({ user, onLogout }) {
    // Default authentication actions.
    return user ? (
        <Button
            onClick={onLogout}
            className="ml-2 rounded-[5px] bg-brand px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
            Log Out
        </Button>
    ) : (
        <>
            <Link className="text-[11px] text-slate-300 transition-colors hover:text-white" href="/sign-in">
                Sign in
            </Link>
            <Link
                className="rounded-[5px] bg-brand px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-brand-hover"
                href="/get-started"
            >
                Get started
            </Link>
        </>
    );
}

export function Navbar({
    brand = <DefaultBrand />,
    items = defaultItems,
    rightContent, // optional: (user, onLogout) => ReactNode
    className,
    maxWidth = "full",
    position = "sticky",
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Check session
    const session = useSession();
    const user = session?.data?.user;
    const navigationItems = items === defaultItems
        ? items.map((item) =>
              item.href === "/dashboard"
                  ? { ...item, href: user ? getDashboardPath(user.role) : item.href }
                  : item,
          )
        : items;

    const logoutUser = async () => {
        await authClient.signOut();
        router.push("/sign-in");
    };

    // Shared responsive navigation bar.
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderedRightContent = rightContent
        ? rightContent(user, logoutUser)
        : <DefaultRightContent user={user} onLogout={logoutUser} />;

    return (
        <nav
            className={cn(
                "z-40 w-full border-b border-hairline/5 bg-[var(--surface-canvas)] text-slate-100",
                position === "sticky" && "sticky top-0",
                position === "fixed" && "fixed top-0",
                className,
            )}
        >
            <section className="container mx-auto">
                {/* Desktop navigation header and responsive actions. */}
                <header
                    className={cn(
                        "mx-auto flex h-[60px] w-full items-center justify-between px-5 sm:px-7",
                        maxWidth !== "full" && maxWidthClasses[maxWidth],
                    )}
                >
                    <div className="flex items-center gap-3">{brand}</div>
                    <ul className="hidden items-center gap-4 md:flex">
                        {navigationItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-sm text-slate-400 transition-colors hover:text-white",
                                            isActive && "text-slate-100",
                                        )}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-4 md:flex">
                            <ThemeToggle />
                            {renderedRightContent}
                        </div>
                        <div className="flex items-center gap-4 md:hidden">
                            <ThemeToggle />
                            <button
                                className="rounded p-1 text-slate-300 transition-colors hover:bg-hairline/10"
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
                        </div>
                    </div>
                </header>

                {/* Mobile navigation menu. */}
                {isMenuOpen && (
                    <div className="border-t border-hairline/10 bg-[var(--surface-canvas)] md:hidden">
                        <ul className="flex flex-col gap-2 p-4">
                            {navigationItems.map(item => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "block py-2 text-sm text-slate-400 transition-colors hover:text-white",
                                                isActive && "font-medium text-slate-100",
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="mt-4 flex flex-col gap-2 border-t border-hairline/10 pt-4">
                                {renderedRightContent}
                            </li>
                        </ul>
                    </div>
                )}
            </section>
        </nav>
    );
}
