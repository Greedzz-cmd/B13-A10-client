import NotFoundContent from "@/components/NotFoundContent";

/** In-segment 404 so notFound() calls keep the Navbar and Footer. */
export default function NotFound() {
    return <NotFoundContent />;
}
