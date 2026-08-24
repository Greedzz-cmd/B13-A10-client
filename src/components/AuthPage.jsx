import Link from "next/link";

const routeNodes = [
    { code: "RGP", className: "route-node route-node-rgp" },
    { code: "RSH", className: "route-node route-node-rsh" },
    { code: "KHL", className: "route-node route-node-khl" },
    { code: "BZL", className: "route-node route-node-bzl" },
    { code: "ZYL", className: "route-node route-node-zyl" },
    { code: "CGP", className: "route-node route-node-cgp" },
    { code: "CXB", className: "route-node route-node-cxb" },
];

function RouteMap() {
    return (
        <div className="route-map" aria-hidden="true">
            <span className="route-line route-line-one" />
            <span className="route-line route-line-two" />
            <span className="route-line route-line-three" />
            <span className="route-line route-line-four" />
            <span className="route-line route-line-five" />
            {routeNodes.map((node) => (
                <span className={node.className} key={node.code}>
                    <i />
                    <b>{node.code}</b>
                </span>
            ))}
            <span className="route-hub">
                <i />
                <b>DAC</b>
            </span>
        </div>
    );
}

export default function AuthPage({ mode }) {
    const isSignup = mode === "signup";

    return (
        <main className="auth-page">
            <section className="auth-story" aria-label="Routely travel platform">
                <RouteMap />
                <div className="story-copy">
                    <div className="brand-lockup">
                        <span className="brand-mark">R</span>
                        <span>Routely</span>
                    </div>
                    <p className="story-quote">&quot;The most elegant way to travel across Bangladesh.&quot;</p>
                    <p className="story-note">{isSignup ? "Join 9,200+ satisfied travelers" : "Your next journey starts here"}</p>
                </div>
            </section>

            <section className="auth-form-panel">
                <div className="auth-form-wrap">
                    <Link className="back-link" href="/">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                    <div className="auth-heading">
                        <h1>{isSignup ? "Create account" : "Welcome back"}</h1>
                        <p>{isSignup ? "Join Bangladesh&apos;s premier travel platform." : "Sign in to continue your journey."}</p>
                    </div>

                    <form className="auth-form">
                        {isSignup && (
                            <label>
                                <span>Full name</span>
                                <input type="text" name="name" placeholder="Nusrat Jahan" autoComplete="name" />
                            </label>
                        )}
                        <label>
                            <span>Email</span>
                            <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" name="password" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} required />
                        </label>
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
                    </form>

                    <p className="auth-switch">
                        {isSignup ? "Already have an account?" : "New to Routely?"}{" "}
                        <Link href={isSignup ? "/signin" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}