import { Skeleton } from "@heroui/react";

/**
 * Placeholder grid for the ticket catalogue. Mirrors the TicketCard shape so
 * the layout does not shift once the real data arrives.
 */
export default function TicketGridSkeleton({ count = 6 }) {
    return (
        <div
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            role="status"
            aria-live="polite"
            aria-label="Loading tickets"
        >
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-[14px] border border-hairline/[0.06] bg-[var(--surface)]"
                >
                    <Skeleton animationType="pulse" className="h-44 w-full rounded-none" />
                    <div className="space-y-3 p-5">
                        <Skeleton animationType="pulse" className="h-3 w-20" />
                        <Skeleton animationType="pulse" className="h-4 w-4/5" />
                        <Skeleton animationType="pulse" className="h-3 w-2/3" />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton animationType="pulse" className="h-4 w-16" />
                            <Skeleton animationType="pulse" className="h-8 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading tickets</span>
        </div>
    );
}
