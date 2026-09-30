"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ToastProvider } from "@heroui/react";

/*
 * One toast region for the whole app, mounted here so every route can call
 * `toast()` from "@heroui/react" without each page wiring up a provider.
 *
 * HeroUI placements are CSS-grid edges ("top end", not "top-right"). "top end"
 * keeps notices out of the way of the sidebar on wide screens and lands above
 * the fold on mobile, where the bottom is usually covered by browser chrome.
 */
const TOAST_PLACEMENT = "top end";

const STORAGE_KEY = "routely-theme";
const ThemeContext = createContext(null);

/**
 * Runs before first paint so a light mode user never sees a dark flash.
 * Mirrors the provider's resolution order: stored choice, then OS preference.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored === "light" || stored === "dark" ? stored : (prefersLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

const resolveInitialTheme = () => {
    if (typeof window === "undefined") {
        return "dark";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(resolveInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);

        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // A blocked storage API should not stop the toggle from working.
        }
    }, [theme]);

    // Follow the OS only while the visitor has not made an explicit choice.
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: light)");

        const handleChange = (event) => {
            if (!window.localStorage.getItem(STORAGE_KEY)) {
                setTheme(event.matches ? "light" : "dark");
            }
        };

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }, []);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {/*
              Mounted as a SIBLING, never around {children}.

              ToastProvider renders its children inside the toast region, and
              react-aria only mounts that region once a toast is visible
              ("visibleToasts.length > 0 ? portal(region) : null"). Wrapping
              the app in it therefore unmounts the whole UI until a toast
              fires, leaving a blank page. Keeping it beside the tree lets any
              page call toast() against the shared queue instead.
            */}
            <ToastProvider placement={TOAST_PLACEMENT} />
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside a ThemeProvider.");
    }

    return context;
}
