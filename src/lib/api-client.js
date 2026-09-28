import { authClient } from "@/lib/auth-client";

/**
 * Call the Express API with a short-lived JWT issued by Better Auth.
 */
export async function authenticatedFetch(path, options = {}) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error(error?.message || "Please sign in to continue.");
    }

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${data.token}`);

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...options,
        headers,
    });
}
