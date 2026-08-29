import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const quickLinks = [
    ["Home", "/"],
    ["All Tickets", "/tickets"],
    ["Vendor Portal", "/vendors"],
    ["Admin", "/admin"],
];

const companyLinks = [
    ["About", "/about"],
    ["Careers", "/careers"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
];

const socialLinks = [
    ["Facebook", "f", "#"],
    ["Instagram", "◎", "#"],
    ["LinkedIn", "in", "#"],
];

function FooterLinks({ title, links }) {
    return (
        <div>
            <h2 className="text-[8px] uppercase tracking-[0.22em] text-slate-500">{title}</h2>
            <ul className="mt-3 space-y-2">
                {links.map(([label, href]) => (
                    <li key={label}>
                        <Link className="text-[9px] text-slate-400 transition-colors hover:text-[#dd7845]" href={href}>
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.05] bg-[#080f1d] px-6 pb-5 pt-12 sm:px-10 lg:px-14">
            <div className="mx-auto max-w-[1232px]">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1.35fr_0.9fr] lg:gap-8">
                    <div>
                        <Link
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-200"
                            href="/"
                        >
                            <span className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#dd7845] text-[8px] text-white">
                                R
                            </span>
                            Routely
                        </Link>
                        <p className="mt-3 max-w-[175px] text-[9px] leading-4 text-slate-500">
                            Bangladesh&apos;s most elegant way to book intercity travel.
                        </p>
                        <div className="mt-4 flex gap-1.5">
                            {socialLinks.map(([label, mark, href]) => (
                                <a
                                    key={label}
                                    aria-label={label}
                                    className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-white/[0.08] text-slate-500 transition-colors hover:border-[#dd7845]/50 hover:text-[#dd7845]"
                                    href={href}
                                >
                                    <span aria-hidden="true" className="text-[9px] font-semibold leading-none">
                                        {mark}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterLinks title="Quick links" links={quickLinks} />

                    <div>
                        <h2 className="text-[8px] uppercase tracking-[0.22em] text-slate-500">Contact</h2>
                        <address className="mt-3 space-y-2.5 not-italic">
                            <p className="flex items-start gap-2 text-[9px] leading-3.5 text-slate-400">
                                <MapPin
                                    aria-hidden="true"
                                    className="mt-px h-3 w-3 shrink-0 text-[#dd7845]"
                                    strokeWidth={1.5}
                                />
                                House 12, Road 5, Banani, Dhaka 1213
                            </p>
                            <a
                                className="flex items-center gap-2 text-[9px] text-slate-400 hover:text-[#dd7845]"
                                href="tel:+8801700000000"
                            >
                                <Phone
                                    aria-hidden="true"
                                    className="h-3 w-3 shrink-0 text-[#dd7845]"
                                    strokeWidth={1.5}
                                />
                                +880 1700 000 000
                            </a>
                            <a
                                className="flex items-center gap-2 text-[9px] text-slate-400 hover:text-[#dd7845]"
                                href="mailto:hello@routely.com.bd"
                            >
                                <Mail
                                    aria-hidden="true"
                                    className="h-3 w-3 shrink-0 text-[#dd7845]"
                                    strokeWidth={1.5}
                                />
                                hello@routely.com.bd
                            </a>
                        </address>
                    </div>

                    <div>
                        <h2 className="text-[8px] uppercase tracking-[0.22em] text-slate-500">My account</h2>
                        <div className="mt-3 flex flex-wrap gap-1">
                            {[
                                { label: "Sign in", href: "/sign-in" },
                                { label: "Reservation", href: "/tickets" },
                                { label: "Help", href: "/" },
                            ].map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="rounded-[2px] border border-white/[0.08] px-2 py-1 text-[8px] text-slate-400 transition-colors hover:border-[#dd7845]/50 hover:text-[#dd7845]"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <FooterLinks title="Company" links={companyLinks} />
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[8px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; 2025 Routely. All rights reserved.</p>
                    <p>Crafted with precision in Dhaka, Bangladesh.</p>
                </div>
            </div>
        </footer>
    );
}
