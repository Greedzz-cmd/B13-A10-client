"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "./ThemeProvider";

/** Switches between the light and dark palettes and remembers the choice. */
export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)]/15 bg-[var(--surface)] text-slate-300 transition-colors hover:border-[var(--accent-ink)]/50 hover:text-[var(--accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-ink)] ${className}`}
        >
            {isDark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
            )}
        </button>
    );
}
