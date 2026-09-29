import FeaturedTicketsSection from "@/components/FeaturedTicketsSection";
import HeroSection from "@/components/HeroSection";
import JourneyCtaSection from "@/components/JourneyCtaSection";
import PopularRoutesSection from "@/components/PopularRoutesSection";
import TransportCategories from "@/components/TransportCategories";
import WhyChooseSection from "@/components/WhyChooseSection";

// The homepage advertises live tickets and routes, so it renders per request
// rather than being frozen at build time.
export const dynamic = "force-dynamic";

/**
 * Busiest routes, grouped server side. Falls back to an empty list, and the
 * section renders its own defaults, if the API is unreachable.
 */
async function getPopularRoutes() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        return [];
    }

    try {
        const response = await fetch(`${apiUrl}/tickets/routes/popular?limit=6`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch popular routes:", error);
        return [];
    }
}

export default async function Home() {
    const routes = await getPopularRoutes();

    return (
        <main className="min-h-screen overflow-hidden bg-[var(--surface-canvas)] text-slate-100">
            <HeroSection />
            <FeaturedTicketsSection />
            <PopularRoutesSection routes={routes} />
            <TransportCategories />
            <WhyChooseSection />
            <JourneyCtaSection />
        </main>
    );
}
