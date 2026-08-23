import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "ticket bari | Your route. Your journey.",
    description: "Book buses, trains, launches and flights across Bangladesh.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="antialiased">{children}</body>
        </html>
    );
}
