import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import "./globals.css";

// Load the application sans and monospace font variables.
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    // Default metadata shared by application routes.
    title: "ticket bari | Your route. Your journey.",
    description: "Book buses, trains, launches and flights across Bangladesh.",
};

export default function RootLayout({ children }) {
    // Root document shell for every route.
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="antialiased">
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
