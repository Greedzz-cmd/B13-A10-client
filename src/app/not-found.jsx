import NotFoundContent from "@/components/NotFoundContent";

/**
 * Root 404. Renders outside the (main) Navbar layout, so it carries its own
 * page shell; the (main) segment has a matching page for notFound() calls.
 */
export default function NotFound() {
    return (
        <main className="min-h-dvh bg-[var(--surface-canvas)]">
            <NotFoundContent />
        </main>
    );
}
