"use client";

import { RouteMap } from "@/components/HeroSection";
import { Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";

export default function AuthPage({ mode }) {
    // Shared sign-in and account-creation page.
    const isSignup = mode === "signup";
    // Collect and preview the submitted form values until backend auth is connected.
    const onSubmit = event => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        window.alert(`Form submitted with: ${JSON.stringify(data, null, 2)}`);
    };

    return (
        <main className="grid min-h-svh bg-[#080f1d] text-[#edf1f7] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
            {/* Brand story panel shown on larger screens. */}
            <section
                className="relative hidden place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_48%,#101c31_0,#0a1221_46%,#080f1d_80%)] lg:grid"
                aria-label="Routely travel platform"
            >
                <div className="absolute inset-0 grid place-items-center opacity-70" aria-hidden="true">
                    <RouteMap />
                </div>
                <div className="relative z-10 w-[44%] max-w-[310px] -translate-x-[8%] translate-y-[5%]">
                    <div className="mb-5 flex items-center gap-2 font-serif text-sm text-[#e6e8ed]">
                        <span className="grid h-[19px] w-[19px] place-items-center rounded-sm bg-[#dc7542] font-sans text-[11px] text-white">
                            R
                        </span>
                        <span>Routely</span>
                    </div>
                    <p className="m-0 font-serif text-[18px] leading-[1.32] text-[#edf0f5]">
                        &quot;The most elegant way to travel across Bangladesh.&quot;
                    </p>
                    <p className="mt-2 text-[10px] text-[#68748a]">
                        {isSignup ? "Join 9,200+ satisfied travelers" : "Your next journey starts here"}
                    </p>
                </div>
            </section>

            {/* Authentication form panel. */}
            <section className="grid min-h-svh place-items-center bg-[#09111f] px-6 py-9 sm:px-12 lg:px-16">
                <div className="w-full max-w-[300px]">
                    <Link
                        className="mb-6 inline-block text-[10px] text-[#667287] transition-colors hover:text-[#e1814d]"
                        href="/"
                    >
                        <span className="mr-1" aria-hidden="true">
                            &larr;
                        </span>{" "}
                        Back to home
                    </Link>
                    <div>
                        <h1 className="m-0 font-serif text-lg text-[#f1f2f4]">
                            {isSignup ? "Create account" : "Welcome back"}
                        </h1>
                        <p className="my-1 mb-5 text-[10px] text-[#69758a]">
                            {isSignup
                                ? "Join Bangladesh's premier travel platform."
                                : "Sign in to continue your journey."}
                        </p>
                    </div>

                    {/* Form fields and mode-specific account controls. */}
                    <Form className="grid gap-3.5" render={props => <form {...props} />} onSubmit={onSubmit}>
                        {isSignup && (
                            <TextField name="name" type="text">
                                <Label className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-[#758096]">
                                    Full name
                                </Label>
                                <Input
                                    className="box-border h-[30px] w-full rounded border border-[#253149] bg-[#151f32] px-2.5 text-[10px] text-[#d9deea] outline-none placeholder:text-[#566277] focus:border-[#d87845] focus:ring-2 focus:ring-[#d8784520]"
                                    placeholder="Nusrat Jahan"
                                    autoComplete="name"
                                />
                            </TextField>
                        )}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            validate={value => {
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                    return "Please enter a valid email address";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-[#758096]">
                                Email
                            </Label>
                            <Input
                                className="box-border h-[30px] w-full rounded border border-[#253149] bg-[#151f32] px-2.5 text-[10px] text-[#d9deea] outline-none placeholder:text-[#566277] focus:border-[#d87845] focus:ring-2 focus:ring-[#d8784520]"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                            <FieldError className="mt-1 text-[8px] text-[#ef9870]" />
                        </TextField>
                        <TextField
                            isRequired
                            minLength={8}
                            name="password"
                            type="password"
                            validate={value => {
                                if (value.length < 8) {
                                    return "Password must be at least 8 characters";
                                }
                                if (!/[A-Z]/.test(value)) {
                                    return "Password must contain at least one uppercase letter";
                                }
                                if (!/[0-9]/.test(value)) {
                                    return "Password must contain at least one number";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1 block text-[8px] uppercase tracking-[0.12em] text-[#758096]">
                                Password
                            </Label>
                            <Input
                                className="box-border h-[30px] w-full rounded border border-[#253149] bg-[#151f32] px-2.5 text-[10px] text-[#d9deea] outline-none placeholder:text-[#566277] focus:border-[#d87845] focus:ring-2 focus:ring-[#d8784520]"
                                placeholder="Enter your password"
                                autoComplete={isSignup ? "new-password" : "current-password"}
                            />
                            <Description className="mt-1 text-[8px] text-[#667287]">
                                Must be at least 8 characters with 1 uppercase and 1 number
                            </Description>
                            <FieldError className="mt-1 text-[8px] text-[#ef9870]" />
                        </TextField>
                        {isSignup && (
                            <label className="text-[8px] text-[#758096]">
                                <span className="mb-1 block uppercase tracking-[0.12em]">Account type</span>
                                <select
                                    className="box-border h-[30px] w-full rounded border border-[#253149] bg-[#151f32] px-2.5 text-[10px] text-[#d9deea] outline-none focus:border-[#d87845] focus:ring-2 focus:ring-[#d8784520]"
                                    name="accountType"
                                    defaultValue="traveler"
                                >
                                    <option value="traveler">Traveler</option>
                                    <option value="operator">Transport operator</option>
                                </select>
                            </label>
                        )}
                        {!isSignup && (
                            <div className="-mt-0.5 flex items-center justify-between text-[8px] text-[#758096]">
                                <label className="flex items-center gap-1">
                                    <input
                                        className="h-[11px] w-[11px] accent-[#dc7a47]"
                                        type="checkbox"
                                        name="remember"
                                    />
                                    <span>Remember me</span>
                                </label>
                                <a className="text-[#dc7a47] no-underline hover:text-[#e1814d]" href="#forgot-password">
                                    Forgot password?
                                </a>
                            </div>
                        )}
                        <button
                            className="h-[30px] rounded border-0 bg-[#de7743] text-[10px] text-white transition hover:-translate-y-px hover:bg-[#ed8651]"
                            type="submit"
                        >
                            {isSignup ? "Create account" : "Sign in"}
                        </button>
                    </Form>

                    <p className="mt-4 text-center text-[9px] text-[#667287]">
                        {isSignup ? "Already have an account?" : "New to Routely?"}{" "}
                        <Link
                            className="text-[#dc7a47] no-underline hover:text-[#e1814d]"
                            href={isSignup ? "/sign-in" : "/get-started"}
                        >
                            {isSignup ? "Sign in" : "Create account"}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
