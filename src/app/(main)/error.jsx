"use client";

import { useEffect } from "react";

/** Error boundary for the marketing and dashboard routes. */
export default function Error({ error, reset }) {
    useEffect(() => {
        // Surface the failure so it is visible during development and triage.
        console.error("Route error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[var(--surface-canvas)] px-6 py-20 sm:px-10">
            <div className="mx-auto w-full max-w-[520px] text-center">
                <p className="text-[8px] uppercase tracking-[0.24em] text-[var(--accent-ink)]">Something went wrong</p>
                <h1 className="mt-4 font-serif text-[40px] leading-none text-slate-100 sm:text-[52px]">Route disrupted</h1>
                <p className="mx-auto mt-5 max-w-[380px] text-[12px] leading-5 text-slate-400">
                    This page failed to load. The problem has been logged, and trying again usually clears it.
                </p>

                {error?.message ? (
                    <pre className="mx-auto mt-6 max-w-full overflow-x-auto rounded-[8px] border border-hairline/[0.06] bg-[var(--surface-inset)] px-4 py-3 text-left text-[10px] leading-4 text-slate-400">
                        {error.message}
                    </pre>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-[5px] bg-brand px-4 py-2.5 text-[10px] font-medium text-white transition-colors hover:bg-brand-hover"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="text-[9px] text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white"
                    >
                        Go back home
                    </a>
                </div>
            </div>
        </main>
    );
}
