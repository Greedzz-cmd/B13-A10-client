import TicketGridSkeleton from "@/components/TicketGridSkeleton";

/** Catalogue placeholder that matches the TicketCard grid. */
export default function Loading() {
    return (
        <div className="bg-[var(--surface-canvas)] px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
            <div className="mx-auto max-w-[1232px]">
                <div className="h-3 w-28 rounded-full bg-[var(--surface-strong)]" />
                <div className="mt-4 h-9 w-72 max-w-full rounded-[6px] bg-[var(--surface-strong)]" />
                <div className="mt-10">
                    <TicketGridSkeleton />
                </div>
            </div>
        </div>
    );
}
