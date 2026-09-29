import { Spinner } from "@heroui/react";

/** Centered route level loading state with an accessible status role. */
export default function RouteLoader({ label = "Loading", className = "py-24 sm:py-32" }) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 px-6 ${className}`}
            role="status"
            aria-live="polite"
        >
            <Spinner color="accent" size="lg" />
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
        </div>
    );
}
