import FeaturedTicketsSection from "@/components/FeaturedTicketsSection";
import HeroSection from "@/components/HeroSection";
import JourneyCtaSection from "@/components/JourneyCtaSection";
import PopularRoutesSection from "@/components/PopularRoutesSection";
import TransportCategories from "@/components/TransportCategories";
import WhyChooseSection from "@/components/WhyChooseSection";

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#080f1d] text-slate-100">
            <HeroSection />
            <FeaturedTicketsSection />
            <PopularRoutesSection />
            <TransportCategories />
            <WhyChooseSection />
            <JourneyCtaSection />
        </main>
    );
}
