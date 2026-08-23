"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

export function AnimatedThemeToggler() {
    const [isDark, setIsDark] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const nextIsDark = savedTheme ? savedTheme === "dark" : prefersDark;

        document.documentElement.classList.toggle("dark", nextIsDark);
        window.queueMicrotask(() => setIsDark(nextIsDark));
    }, []);

    function toggleTheme() {
        const nextIsDark = !isDark;
        const updateTheme = () => {
            document.documentElement.classList.toggle("dark", nextIsDark);
            window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
            setIsDark(nextIsDark);
        };

        if (document.startViewTransition) {
            const button = buttonRef.current;
            if (!button) {
                updateTheme();
                return;
            }
            const bounds = button.getBoundingClientRect();
            const x = bounds.left + bounds.width / 2;
            const y = bounds.top + bounds.height / 2;
            const radius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );
            const clipPath = [
                `circle(0 at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
            ];
            const transition = document.startViewTransition(() => flushSync(updateTheme));

            transition.ready.then(() => {
                document.documentElement.animate(
                    { clipPath },
                    {
                        duration: 400,
                        easing: "ease-in-out",
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });
        } else {
            updateTheme();
        }
    }

    return (
        <button
            className="rounded p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            type="button"
            ref={buttonRef}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={isDark}
            onClick={toggleTheme}
        >
            {isDark ? (
                <Sun className="size-4 rotate-180 scale-90 transition-all duration-300" aria-hidden="true" />
            ) : (
                <Moon className="size-4 rotate-0 scale-100 transition-all duration-300" aria-hidden="true" />
            )}
        </button>
    );
}
