/**
 * Redirect plumbing for the auth flow.
 *
 * When a signed-out visitor opens a page that needs a session, we stash where
 * they were headed in `?callbackUrl=` and hand it back after they sign in.
 * The alternative — always landing on "/" — strands people who clicked a
 * specific ticket or dashboard link.
 */

// The sign-in and sign-up forms must never win a callback, otherwise a stale
// link would bounce a freshly authenticated user straight back to the form.
// /onboarding is deliberately absent: it is a post-auth step that checks for a
// session itself, so returning there after sign-in cannot loop.
const AUTH_FORM_ROUTES = ["/sign-in", "/get-started"];

/**
 * Accept a caller-supplied callback only when it is a path on this site.
 *
 * Anything absolute, protocol-relative, or schemeless ("evil.com") is dropped
 * so the query string cannot be used as an open redirect.
 */
export function sanitizeCallbackUrl(value) {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();

    if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
    if (
        AUTH_FORM_ROUTES.some(
            (route) => trimmed === route || trimmed.startsWith(`${route}/`)
        )
    ) {
        return null;
    }

    return trimmed;
}

/** Build a sign-in link that returns the visitor to `path` afterwards. */
export function signInHref(path) {
    const safe = sanitizeCallbackUrl(path);

    return safe ? `/sign-in?callbackUrl=${encodeURIComponent(safe)}` : "/sign-in";
}

/** Build the sign-up link that keeps the same post-auth destination. */
export function signUpHref(path) {
    const safe = sanitizeCallbackUrl(path);

    return safe ? `/get-started?callbackUrl=${encodeURIComponent(safe)}` : "/get-started";
}

/**
 * Read the destination out of a client URL.
 *
 * Callers pass the whole `location` rather than only `pathname` so query
 * strings and hashes on the original page survive the round trip.
 */
export function callbackFromSearch(search) {
    if (typeof search !== "string") return null;

    const raw = new URLSearchParams(search).get("callbackUrl");

    return sanitizeCallbackUrl(raw);
}
