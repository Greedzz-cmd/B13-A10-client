import RouteLoader from "@/components/RouteLoader";

/** Shown while a route in this segment is being fetched. */
export default function Loading() {
    return <RouteLoader label="Loading" />;
}
