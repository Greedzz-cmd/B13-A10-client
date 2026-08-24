"use client";

import { RouteMap } from "@/components/HeroSection";
import { Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";

export default function AuthPage({ mode }) {
    const isSignup = mode === "signup";
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
        <main className="auth-page">
            <section className="auth-story" aria-label="Routely travel platform">
                <div className="auth-hero-map" aria-hidden="true">
                    <RouteMap />
                </div>
                <div className="story-copy">
                    <div className="brand-lockup">
                        <span className="brand-mark">R</span>
                        <span>Routely</span>
                    </div>
                    <p className="story-quote">&quot;The most elegant way to travel across Bangladesh.&quot;</p>
                    <p className="story-note">
                        {isSignup ? "Join 9,200+ satisfied travelers" : "Your next journey starts here"}
                    </p>
                </div>
            </section>

            <section className="auth-form-panel">
                <div className="auth-form-wrap">
                    <Link className="back-link" href="/">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                    <div className="auth-heading">
                        <h1>{isSignup ? "Create account" : "Welcome back"}</h1>
                        <p>
                            {isSignup
                                ? "Join Bangladesh's premier travel platform."
                                : "Sign in to continue your journey."}
                        </p>
                    </div>

                    <Form
                        className="auth-form"
                        render={props => <form {...props} data-custom="auth-form" />}
                        onSubmit={onSubmit}
                    >
                        {isSignup && (
                            <TextField name="name" type="text">
                                <Label className="auth-label">Full name</Label>
                                <Input className="auth-input" placeholder="Nusrat Jahan" autoComplete="name" />
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
                            <Label className="auth-label">Email</Label>
                            <Input className="auth-input" placeholder="you@example.com" autoComplete="email" />
                            <FieldError className="auth-error" />
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
                            <Label className="auth-label">Password</Label>
                            <Input
                                className="auth-input"
                                placeholder="Enter your password"
                                autoComplete={isSignup ? "new-password" : "current-password"}
                            />
                            <Description className="auth-description">
                                Must be at least 8 characters with 1 uppercase and 1 number
                            </Description>
                            <FieldError className="auth-error" />
                        </TextField>
                        {isSignup && (
                            <label>
                                <span>Account type</span>
                                <select name="accountType" defaultValue="traveler">
                                    <option value="traveler">Traveler</option>
                                    <option value="operator">Transport operator</option>
                                </select>
                            </label>
                        )}
                        {!isSignup && (
                            <div className="form-options">
                                <label className="check-label">
                                    <input type="checkbox" name="remember" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#forgot-password">Forgot password?</a>
                            </div>
                        )}
                        <button type="submit">{isSignup ? "Create account" : "Sign in"}</button>
                    </Form>

                    <p className="auth-switch">
                        {isSignup ? "Already have an account?" : "New to Routely?"}{" "}
                        <Link href={isSignup ? "/sign-in" : "/get-started"}>
                            {isSignup ? "Sign in" : "Create account"}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
