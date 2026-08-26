import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import JourneyCtaSection from "@/components/JourneyCtaSection";
import { Navbar } from "@/components/Navbar";
import TransportCategories from "@/components/TransportCategories";
import WhyChooseSection from "@/components/WhyChooseSection";

export default function Home() {
    // Landing page composed of navigation, hero search, and category links.
    return (
        <main className="min-h-screen overflow-hidden bg-[#080f1d] text-slate-100">
            <Navbar />
            <HeroSection />
            <TransportCategories />
            <WhyChooseSection />
            <JourneyCtaSection />
            <Footer />
        </main>
    );
}
