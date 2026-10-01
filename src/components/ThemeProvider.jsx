"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
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

/*
 * The theme lives in localStorage, which makes it an external store.
 *
 * Reading it during render is what caused the hydration mismatch: the server
 * could only render "dark", so a light-mode visitor received server markup with
 * a Sun icon and client markup with a Moon one. useSyncExternalStore fixes that
 * by letting React compare a server snapshot with the client store and re-render
 * once it knows the difference, instead of guessing during the first paint.
 */
const subscribeToTheme = (onStoreChange) => {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener("routely-theme-change", onStoreChange);

    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("routely-theme-change", onStoreChange);
    };
};

const getThemeSnapshot = () => resolveInitialTheme();

// What the server rendered. React uses it for the hydration pass and then
// re-renders with the real client value.
const getServerThemeSnapshot = () => "dark";

const persistTheme = (next) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // A blocked storage API should not stop the toggle from working.
    }

    // Same-tab listeners do not receive the "storage" event.
    window.dispatchEvent(new Event("routely-theme-change"));
};

export function ThemeProvider({ children }) {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

    useEffect(() => {
        // The pre-paint script in the root layout has already set the right
        // attribute; this keeps it in step with the resolved store value.
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Follow the OS only while the visitor has not made an explicit choice.
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: light)");

        const handleChange = (event) => {
            if (!window.localStorage.getItem(STORAGE_KEY)) {
                const next = event.matches ? "light" : "dark";

                document.documentElement.setAttribute("data-theme", next);
                // Not persisted: an OS flip is not a choice, so keep following
                // the OS until the visitor uses the toggle themselves.
                window.dispatchEvent(new Event("routely-theme-change"));
            }
        };

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        const next = theme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        persistTheme(next);
    }, [theme]);

    // The theme now comes from an external store, so there is no setTheme to
    // hand out: writing is done by toggleTheme (and by the OS-follow effect),
    // which persist the choice and notify subscribers.
    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

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
