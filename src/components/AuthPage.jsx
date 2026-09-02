"use client";

import { Eye, EyeOff, Luggage, Store, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { RouteMap } from "./HeroSection";
import { authClient } from "../lib/auth-client";

export default function AuthPage({ mode }) {
    const isSignup = mode === "signup";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState("traveller");

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = isSignup
            ? await authClient.signUp.email({
                  name: formData.get("name"),
                  email: formData.get("email"),
                  password: formData.get("password"),
                  userType: formData.get("userType"),
              })
            : await authClient.signIn.email({
                  email: formData.get("email"),
                  password: formData.get("password"),
              });

        console.log("Auth data:", result.data);

        if (result.error) {
            console.error("Auth error:", result.error);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#071c2f] text-slate-100">
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, #071c2f 0%, #091622 100%)",
                }}
            />

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#dd8747]/[0.045] blur-[130px]" />

            <div className="pointer-events-none absolute right-[-180px] top-1/3 h-[600px] w-[600px] rounded-full bg-[#174566]/30 blur-[140px]" />

            <div className="relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,1.38fr)_minmax(420px,0.82fr)]">
                {/* LEFT SIDE */}
                <section
                    className="relative hidden overflow-hidden lg:block"
                    aria-label="Routely travel platform"
                >
                    {/* Map */}
                    <div className="absolute inset-0 flex items-end justify-center opacity-[0.88]">
                        <div className="h-[92%] w-full max-w-[760px] translate-y-8">
                            <RouteMap />
                        </div>
                    </div>

                    {/* Map overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#071c2f]/20 via-transparent to-[#071c2f]/40" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#071c2f] to-transparent" />

                    {/* Logo */}
                    <header className="absolute left-7 top-5 z-10 flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#db7743] text-[11px] font-bold text-white shadow-[0_0_25px_rgba(219,119,67,0.3)]">
                            R
                        </span>

                        <span className="font-serif text-[19px] tracking-[-0.02em] text-white/90">
                            Routely
                        </span>
                    </header>

                    {/* Quote + Stats */}
                    <div className="absolute bottom-10 left-9 z-10 max-w-[360px]">
                        <p className="font-serif text-[23px] leading-[1.18] tracking-[-0.025em] text-slate-100">
                            &quot;The most elegant way to
                            <br />
                            travel across Bangladesh.&quot;
                        </p>

                        <div className="mt-8 flex gap-9 text-[10px] text-slate-400">
                            <div>
                                <span className="font-serif text-[23px] text-slate-100">
                                    9,200+
                                </span>

                                <div className="mt-1.5 uppercase tracking-[0.14em]">
                                    Travelers
                                </div>
                            </div>

                            <div>
                                <span className="font-serif text-[23px] text-slate-100">
                                    45
                                </span>

                                <div className="mt-1.5 uppercase tracking-[0.14em]">
                                    Routes
                                </div>
                            </div>

                            <div>
                                <span className="font-serif text-[23px] text-slate-100">
                                    4
                                </span>

                                <div className="mt-1.5 uppercase tracking-[0.14em]">
                                    Modes
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 lg:pr-10">
                    {/* Card glow */}
                    <div className="pointer-events-none absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#dd8747]/[0.06] blur-[100px]" />

                    {/* Auth Card */}
                    <div className="relative w-full max-w-[480px] rounded-[22px] border border-white/[0.07] bg-[#10283b]/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
                        {/* Back to home */}
                        <div className="mb-7 flex justify-end text-[10px] text-slate-400">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-2 transition-colors hover:text-[#ee9b61]"
                            >
                                <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                                    ←
                                </span>

                                Go back to home
                            </Link>
                        </div>

                        {/* Heading */}
                        <div className="mb-7">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                {isSignup
                                    ? "Start your journey"
                                    : "Welcome back"}
                            </div>

                            <h1 className="font-serif text-[40px] leading-[0.94] tracking-[-0.055em] text-white">
                                {isSignup
                                    ? "Create account"
                                    : "Welcome back"}
                            </h1>

                            <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
                                {isSignup
                                    ? "Join Bangladesh's premier travel platform."
                                    : "Sign in to continue your journey."}
                            </p>
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="group flex h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-[#eef3f7] px-4 text-[12px] font-medium text-slate-900 transition-all duration-200 hover:bg-white hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
                        >
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold shadow-sm">
                                G
                            </span>

                            <span>Continue with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-slate-600">
                            <span className="h-px flex-1 bg-white/[0.07]" />
                            OR
                            <span className="h-px flex-1 bg-white/[0.07]" />
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={onSubmit}>
                            {/* Full Name */}
                            {isSignup && (
                                <div>
                                    <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                        Full name
                                    </label>

                                    <input
                                        className="h-[47px] w-full rounded-xl border border-[#2b3a50] bg-[#172d41]/90 px-3.5 text-[12px] text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-[#dd8747]/70 focus:bg-[#1a3145] focus:ring-2 focus:ring-[#dd8747]/10"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            )}

                            {/* Account Type */}
                            {isSignup && (
                                <div className="pt-1">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                            Account type
                                        </div>

                                        <span className="text-[9px] text-slate-600">
                                            Choose your role
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Traveller */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setUserType("traveller")
                                            }
                                            aria-pressed={
                                                userType === "traveller"
                                            }
                                            className={`relative min-h-[104px] overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                                                userType === "traveller"
                                                    ? "border-[#dd8747] bg-[#1d3549] shadow-[0_0_0_1px_rgba(221,135,71,0.1),0_10px_30px_rgba(0,0,0,0.18)]"
                                                    : "border-[#2b3a50] bg-[#172d41]/90 hover:border-[#4a5d72]"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div
                                                    className={`grid h-9 w-9 place-items-center rounded-xl transition-all duration-200 ${
                                                        userType === "traveller"
                                                            ? "bg-[#dd8747]/15 text-[#ee9b61]"
                                                            : "bg-[#223c50] text-slate-400"
                                                    }`}
                                                >
                                                    <Luggage className="h-[17px] w-[17px]" />
                                                </div>

                                                <div
                                                    className={`grid h-[17px] w-[17px] place-items-center rounded-full border transition-all duration-200 ${
                                                        userType === "traveller"
                                                            ? "border-[#dd8747] bg-[#dd8747]"
                                                            : "border-[#405268] bg-transparent"
                                                    }`}
                                                >
                                                    {userType ===
                                                        "traveller" && (
                                                        <Check className="h-2.5 w-2.5 text-white" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="text-[12px] font-medium text-white">
                                                    Traveller
                                                </div>

                                                <div className="mt-1 text-[9px] leading-tight text-slate-500">
                                                    Find and book journeys
                                                </div>
                                            </div>
                                        </button>

                                        {/* Vendor */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setUserType("vendor")
                                            }
                                            aria-pressed={
                                                userType === "vendor"
                                            }
                                            className={`relative min-h-[104px] overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                                                userType === "vendor"
                                                    ? "border-[#dd8747] bg-[#1d3549] shadow-[0_0_0_1px_rgba(221,135,71,0.1),0_10px_30px_rgba(0,0,0,0.18)]"
                                                    : "border-[#2b3a50] bg-[#172d41]/90 hover:border-[#4a5d72]"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div
                                                    className={`grid h-9 w-9 place-items-center rounded-xl transition-all duration-200 ${
                                                        userType === "vendor"
                                                            ? "bg-[#dd8747]/15 text-[#ee9b61]"
                                                            : "bg-[#223c50] text-slate-400"
                                                    }`}
                                                >
                                                    <Store className="h-[17px] w-[17px]" />
                                                </div>

                                                <div
                                                    className={`grid h-[17px] w-[17px] place-items-center rounded-full border transition-all duration-200 ${
                                                        userType === "vendor"
                                                            ? "border-[#dd8747] bg-[#dd8747]"
                                                            : "border-[#405268] bg-transparent"
                                                    }`}
                                                >
                                                    {userType === "vendor" && (
                                                        <Check className="h-2.5 w-2.5 text-white" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="text-[12px] font-medium text-white">
                                                    Vendor
                                                </div>

                                                <div className="mt-1 text-[9px] leading-tight text-slate-500">
                                                    Offer routes and services
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Hidden value submitted with FormData */}
                                    <input
                                        type="hidden"
                                        name="userType"
                                        value={userType}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                    Email address
                                </label>

                                <input
                                    className="h-[47px] w-full rounded-xl border border-[#2b3a50] bg-[#172d41]/90 px-3.5 text-[12px] text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-[#dd8747]/70 focus:bg-[#1a3145] focus:ring-2 focus:ring-[#dd8747]/10"
                                    type="email"
                                    name="email"
                                    placeholder="Enter an email address"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        className="h-[47px] w-full rounded-xl border border-[#2b3a50] bg-[#172d41]/90 px-3.5 pr-11 text-[12px] text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-[#dd8747]/70 focus:bg-[#1a3145] focus:ring-2 focus:ring-[#dd8747]/10"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        autoComplete={
                                            isSignup
                                                ? "new-password"
                                                : "current-password"
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword(
                                                (value) => !value
                                            )
                                        }
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            {isSignup && (
                                <div>
                                    <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <input
                                            className="h-[47px] w-full rounded-xl border border-[#2b3a50] bg-[#172d41]/90 px-3.5 pr-11 text-[12px] text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-[#dd8747]/70 focus:bg-[#1a3145] focus:ring-2 focus:ring-[#dd8747]/10"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            placeholder="Enter your password again"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (value) => !value
                                                )
                                            }
                                            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-200"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="mt-2 h-[49px] w-full rounded-xl bg-[#dd8747] px-4 text-[12px] font-semibold text-white shadow-[0_8px_25px_rgba(221,135,71,0.18)] transition-all duration-200 hover:bg-[#ee9b61] hover:shadow-[0_10px_30px_rgba(221,135,71,0.25)] active:scale-[0.99]"
                            >
                                {isSignup ? "Create account" : "Sign in"}
                            </button>
                        </form>

                        {/* Switch auth mode */}
                        <p className="mt-6 text-center text-[11px] text-slate-500">
                            {isSignup
                                ? "Already have an account?"
                                : "Don’t have an account?"}{" "}
                            <Link
                                href={isSignup ? "/sign-in" : "/get-started"}
                                className="font-medium text-[#dd8747] transition-colors hover:text-[#f4a571]"
                            >
                                {isSignup ? "Sign in" : "Register"}
                            </Link>
                        </p>

                        {/* Terms */}
                        {isSignup && (
                            <p className="mt-4 text-center text-[9px] leading-relaxed text-slate-600">
                                By creating an account you agree to our{" "}
                                <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-slate-400">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-slate-400">
                                    Privacy Policy
                                </span>
                                .
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}