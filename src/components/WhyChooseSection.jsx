import { CalendarCheck, CreditCard, MapPinned, TicketCheck } from "lucide-react";

const reasons = [
    {
        title: "Verified Tickets",
        description: "Every ticket is checked by our team, so there are no surprises when your journey begins.",
        icon: TicketCheck,
    },
    {
        title: "Secure Payments",
        description: "Bank-grade encryption protects every transaction, wherever you travel.",
        icon: CreditCard,
    },
    {
        title: "Multiple Transport",
        description: "Flights, trains, buses and launches, all in one place across Bangladesh.",
        icon: MapPinned,
    },
    {
        title: "Easy Booking",
        description: "Search, compare and book in minutes, with instant confirmation and digital boarding passes.",
        icon: CalendarCheck,
    },
];

export default function WhyChooseSection() {
    return (
        <section className="border-y border-white/[0.04] bg-[#0b1425] px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
            <div className="mx-auto max-w-[1232px]">
                <div className="mx-auto max-w-[430px] text-center">
                    <p className="text-[8px] uppercase tracking-[0.24em] text-[#dd7845]">Why choose Routely</p>
                    <h2 className="mt-3 font-serif text-[27px] leading-none text-slate-100 sm:text-[30px]">
                        Travel booking, thoughtfully done.
                    </h2>
                    <p className="mx-auto mt-3 max-w-[370px] text-[10px] leading-4 text-slate-500">
                        We&apos;ve reimagined travel booking for Bangladesh, combining the ease of modern travel with
                        the warmth of a premium experience.
                    </p>
                </div>

                <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map(({ title, description, icon: Icon }) => (
                        <article
                            key={title}
                            className="min-h-[145px] rounded-[5px] border border-white/[0.06] bg-[#172238] p-4 transition-colors hover:border-[#dd7845]/30 hover:bg-[#1a2942]"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#dd7845]/20 bg-[#2a2630] text-[#dd7845]">
                                <Icon aria-hidden="true" className="h-3 w-3" strokeWidth={1.6} />
                            </span>
                            <h3 className="mt-3 font-serif text-[13px] text-slate-200">{title}</h3>
                            <p className="mt-1.5 text-[9px] leading-[1.55] text-slate-500">{description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
