"use client";

import { useEffect } from "react";

/** Last-resort boundary for failures in the root layout itself. */
export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="en" data-theme="dark">
            <body className="min-h-dvh bg-[var(--surface-canvas)] font-sans text-slate-100">
                <main className="flex min-h-dvh items-center justify-center px-6">
                    <div className="mx-auto w-full max-w-[520px] text-center">
                        <p className="text-[8px] uppercase tracking-[0.24em] text-[var(--accent-ink)]">
                            Application error
                        </p>
                        <h1 className="mt-4 font-serif text-[40px] leading-none sm:text-[52px]">Routely is down</h1>
                        <p className="mx-auto mt-5 max-w-[380px] text-[12px] leading-5 text-slate-400">
                            The application shell failed to render, which usually points at a build or network problem
                            rather than anything you did.
                        </p>
                        <button
                            type="button"
                            onClick={reset}
                            className="mt-8 rounded-[5px] bg-brand px-4 py-2.5 text-[10px] font-medium text-white transition-colors hover:bg-brand-hover"
                        >
                            Reload Routely
                        </button>
                    </div>
                </main>
            </body>
        </html>
    );
}
