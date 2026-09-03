import Link from "next/link";
import RouteSearchWidget from "./RouteSearchWidget";

export function RouteMap() {
    // Decorative route map used by the hero and authentication story panels.
    return (
        <div className="relative h-full w-full min-h-[520px] opacity-90" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 620 520" fill="none">
                <g stroke="#c96d40" strokeDasharray="4 6" strokeOpacity="0.42">
                    <path d="M304 228C228 195 182 180 104 165" />
                    <path d="M304 228C260 263 204 301 131 332" />
                    <path d="M304 228C371 183 428 145 523 116" />
                    <path d="M304 228C367 228 436 242 503 286" />
                    <path d="M304 228C372 260 454 324 542 377" />
                    <path d="M304 228C278 155 259 99 232 52" />
                </g>
                <g fill="#dd7845" fillOpacity="0.9" stroke="#f3a06f" strokeOpacity="0.35">
                    <circle cx="304" cy="228" r="8" />
                    <circle cx="104" cy="165" r="5" />
                    <circle cx="131" cy="332" r="5" />
                    <circle cx="523" cy="116" r="5" />
                    <circle cx="503" cy="286" r="5" />
                    <circle cx="542" cy="377" r="5" />
                    <circle cx="232" cy="52" r="5" />
                </g>
            </svg>
            <span className="absolute left-[50%] top-[47%] text-[9px] text-slate-400">DAC</span>
            <span className="absolute left-[37%] top-[10%] text-[9px] text-slate-500">RGP</span>
            <span className="absolute left-[14%] top-[40%] text-[9px] text-slate-500">RSH</span>
            <span className="absolute left-[18%] top-[78%] text-[9px] text-slate-500">KHL</span>
            <span className="absolute right-[8%] top-[20%] text-[9px] text-slate-500">ZYL</span>
            <span className="absolute right-[13%] top-[60%] text-[9px] text-slate-500">CGP</span>
            <span className="absolute right-[6%] bottom-[12%] text-[9px] text-slate-500">CXB</span>
        </div>
    );
}

export default function HeroSection() {
    // Landing page hero rendered on the server with interactive search widget.
    return (
        <section
            className="relative min-h-[calc(100vh-60px)] w-full px-6 pb-8 pt-16 sm:px-10 sm:pt-20 lg:px-14"
            style={{
                background: "linear-gradient(90deg, #071a2d 0%, #071d31 30%, #071a2b 62%, #050d17 100%)",
            }}
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(8,15,29,0), rgba(8,15,29,0.65))" }}
            />
            <div className="relative mx-auto max-w-[1280px]">
                {/* Hero copy and route map visual. */}
                <div className="relative grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
                    {/* Introductory product messaging and primary calls to action. */}
                    <div className="relative z-10 max-w-[510px]">
                        <p className="mb-7 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#dd7845]">
                            <span className="h-px w-2 bg-[#dd7845]" /> Bangladesh&apos;s premium travel platform{" "}
                            <span className="h-px w-2 bg-[#dd7845]" />
                        </p>
                        <h1 className="font-serif text-[46px] leading-[1.02] tracking-normal text-slate-100 sm:text-[54px]">
                            Your route.
                            <br />
                            Your time.
                            <br />
                            <span className="text-[#e27b45]">Your journey.</span>
                        </h1>
                        <p className="mt-5 max-w-[390px] text-[13px] leading-5 text-slate-400">
                            Book buses, trains, launches and flights across Bangladesh. Seamlessly. Elegantly. All in
                            one place.
                        </p>
                        <div className="mt-7 flex items-center gap-3">
                            <Link
                                className="rounded-[5px] bg-[#dd7845] px-5 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-[#ef8a53]"
                                href="/tickets"
                            >
                                Explore routes <span className="ml-2">→</span>
                            </Link>
                            <Link
                                className="text-[10px] text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white"
                                href="/get-started"
                            >
                                Create account — it&apos;s free
                            </Link>
                        </div>
                        <div className="mt-10 grid max-w-[430px] grid-cols-3 border-t border-white/10 pt-5">
                            <div>
                                <p className="font-serif text-[16px] text-slate-200">9,200+</p>
                                <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">TRAVELERS MONTHLY</p>
                            </div>
                            <div>
                                <p className="font-serif text-[16px] text-slate-200">45</p>
                                <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">ROUTES COVERED</p>
                            </div>
                            <div>
                                <p className="font-serif text-[16px] text-slate-200">4</p>
                                <p className="mt-1 text-[8px] tracking-[0.08em] text-slate-500">TRANSPORT MODES</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-7%] top-[220px] z-0 w-[125%] opacity-45 md:right-0 md:flex md:w-full md:justify-end lg:relative lg:right-auto lg:top-auto lg:w-auto lg:justify-center lg:pt-2 lg:opacity-80">
                        <RouteMap />
                    </div>
                </div>
            </div>

            {/* Interactive route search card island */}
            <RouteSearchWidget />
        </section>
    );
}
