import { Plane } from "lucide-react";

export default function FeaturedTicketsSection() {
    return (
        <section className="border-b border-white/5 bg-[#071322] px-5 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-[1200px]">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-5">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dd7845]/60 bg-[#121d2c] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#dd7845] shadow-[0_0_0_1px_rgba(221,120,69,0.18)]">
                            <Plane aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
                            Admin&apos;s picks
                        </span>

                        <div className="space-y-3">
                            <h2 className="font-serif text-[34px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-100 sm:text-[52px]">
                                Featured tickets
                            </h2>
                            <p className="max-w-[760px] text-[15px] text-slate-400 sm:text-[17px]">
                                Hand-selected by our team for exceptional value and experience.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="hidden items-center gap-2 text-[15px] text-slate-300 transition-colors hover:text-white sm:inline-flex"
                    >
                        View all <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
