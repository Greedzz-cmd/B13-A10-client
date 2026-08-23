import HeroSection from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#080f1d] text-slate-100">
            <Navbar />
            <HeroSection />
        </main>
    );
}
