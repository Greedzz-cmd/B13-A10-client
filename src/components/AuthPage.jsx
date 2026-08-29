"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RouteMap } from "./HeroSection";

export default function AuthPage({ mode }) {
    const isSignup = mode === "signup";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = event => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        window.alert(`Form submitted with: ${JSON.stringify(payload, null, 2)}`);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#071826] text-slate-100">
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(90deg, #071b2e 0%, #071d31 30%, #071a2b 62%, #050d17 100%)",
                }}
            />

            <div className="relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,1.38fr)_minmax(420px,0.82fr)]">
                <section className="relative hidden overflow-hidden lg:block" aria-label="Routely travel platform">
                    <div className="absolute inset-0 flex items-end justify-center opacity-90">
                        <div className="h-[92%] w-[100%] max-w-[760px] translate-y-8">
                            <RouteMap />
                        </div>
                    </div>

                    <header className="absolute left-6 top-4 z-10 flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#db7743] text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(219,119,67,0.45)]">
                            R
                        </span>
                        <span className="font-serif text-[18px] text-white/90">Routely</span>
                    </header>

                    <div className="absolute bottom-10 left-8 z-10 max-w-[300px]">
                        <p className="font-serif text-[21px] leading-[1.2] text-slate-100">
                            &quot;The most elegant way to
                            <br />
                            travel across Bangladesh.&quot;
                        </p>
                        <div className="mt-7 flex gap-8 text-[11px] text-slate-400">
                            <div>
                                <span className="font-serif text-[22px] text-slate-100">9,200+</span>
                                <div className="mt-1 uppercase tracking-[0.12em]">Travelers</div>
                            </div>
                            <div>
                                <span className="font-serif text-[22px] text-slate-100">45</span>
                                <div className="mt-1 uppercase tracking-[0.12em]">Routes</div>
                            </div>
                            <div>
                                <span className="font-serif text-[22px] text-slate-100">4</span>
                                <div className="mt-1 uppercase tracking-[0.12em]">Modes</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 lg:pr-10">
                    <div className="w-full max-w-[410px] rounded-[18px] border border-white/10 bg-[#0f1f32]/85 p-4 shadow-[0_20px_80px_rgba(2,6,15,0.65)] backdrop-blur-sm sm:p-5">
                        <div className="mb-5 flex justify-end text-[10px] text-slate-400">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 transition-colors hover:text-[#dd8747]"
                            >
                                <span aria-hidden="true">←</span> Go back to home
                            </Link>
                        </div>

                        <div className="mb-5">
                            <h1 className="font-serif text-[32px] leading-none text-white">
                                {isSignup ? "Create account" : "Welcome back"}
                            </h1>
                            <p className="mt-2 text-[12px] text-slate-400">
                                {isSignup
                                    ? "Join Bangladesh's premier travel platform."
                                    : "Sign in to continue your journey."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#f2f5f8] px-4 py-3 text-[12px] font-medium text-slate-900 transition hover:bg-white"
                        >
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-slate-700">
                                G
                            </span>
                            Continue with Google
                        </button>

                        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            <span className="h-px flex-1 bg-white/10" />
                            OR
                            <span className="h-px flex-1 bg-white/10" />
                        </div>

                        <form className="space-y-3.5" onSubmit={onSubmit}>
                            {isSignup && (
                                <label className="block text-[9px] uppercase tracking-[0.16em] text-slate-400">
                                    Full name
                                    <input
                                        className="mt-2 h-11 w-full rounded-lg border border-[#2b3a50] bg-[#162a40] px-3 text-[12px] text-white placeholder:text-slate-500 outline-none transition focus:border-[#dd8747]"
                                        type="text"
                                        name="name"
                                        placeholder="Nusrat Jahan"
                                        autoComplete="name"
                                    />
                                </label>
                            )}

                            <label className="block text-[9px] uppercase tracking-[0.16em] text-slate-400">
                                Email address
                                <input
                                    className="mt-2 h-11 w-full rounded-lg border border-[#2b3a50] bg-[#162a40] px-3 text-[12px] text-white placeholder:text-slate-500 outline-none transition focus:border-[#dd8747]"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </label>

                            <label className="block text-[9px] uppercase tracking-[0.16em] text-slate-400">
                                Password
                                <div className="relative mt-2">
                                    <input
                                        className="h-11 w-full rounded-lg border border-[#2b3a50] bg-[#162a40] px-3 pr-10 text-[12px] text-white placeholder:text-slate-500 outline-none transition focus:border-[#dd8747]"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        autoComplete={isSignup ? "new-password" : "current-password"}
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={() => setShowPassword(value => !value)}
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </label>

                            {isSignup && (
                                <label className="block text-[9px] uppercase tracking-[0.16em] text-slate-400">
                                    Confirm password
                                    <div className="relative mt-2">
                                        <input
                                            className="h-11 w-full rounded-lg border border-[#2b3a50] bg-[#162a40] px-3 pr-10 text-[12px] text-white placeholder:text-slate-500 outline-none transition focus:border-[#dd8747]"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            aria-label={
                                                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                                            }
                                            onClick={() => setShowConfirmPassword(value => !value)}
                                            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </label>
                            )}

                            {!isSignup && (
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="remember" className="h-4 w-4 accent-[#dd8747]" />
                                        Remember me
                                    </label>
                                    <a href="#forgot-password" className="text-[#dd8747] hover:text-[#f4a571]">
                                        Forgot?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="mt-1 w-full rounded-xl bg-[#dd8747] px-4 py-3 text-[12px] font-semibold text-white transition hover:bg-[#ee9b61]"
                            >
                                {isSignup ? "Create account" : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-5 text-center text-[12px] text-slate-400">
                            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
                            <Link
                                href={isSignup ? "/sign-in" : "/get-started"}
                                className="font-medium text-[#dd8747] hover:text-[#f4a571]"
                            >
                                {isSignup ? "Sign in" : "Register"}
                            </Link>
                        </p>

                        {isSignup && (
                            <p className="mt-3 text-center text-[9px] text-slate-500">
                                By creating an account you agree to our terms of service and privacy policy.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            <button
                type="button"
                aria-label="Help"
                className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#122236] text-lg text-slate-200 shadow-lg shadow-black/20 transition hover:bg-[#172c45]"
            >
                ?
            </button>
        </main>
    );
}
