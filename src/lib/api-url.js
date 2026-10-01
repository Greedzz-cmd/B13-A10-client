/**
 * NEXT_PUBLIC_API_URL is commonly written with a trailing slash. Joining that
 * straight onto a path that starts with "/" produces "//tickets", which the
 * deployed API rejects outright, so the browser reports a bare NetworkError
 * with no status and no failing response. Normalise the base once here rather
 * than trusting every call site to strip its own slash.
 */
export const apiBaseUrl = () => (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/** Joins the API base with an absolute path, tolerating a trailing-slash base. */
export const apiUrl = (path = "") => {
    const base = apiBaseUrl();

    if (!path) {
        return base;
    }

    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};