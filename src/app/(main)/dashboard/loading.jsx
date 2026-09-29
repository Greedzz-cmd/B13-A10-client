import RouteLoader from "@/components/RouteLoader";

/** Shown while the role-aware dashboard shell resolves. */
export default function Loading() {
    return <RouteLoader label="Loading dashboard" className="min-h-[60vh] py-32" />;
}
