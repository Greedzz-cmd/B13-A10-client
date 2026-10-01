import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api-url";

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

    return fetch(apiUrl(path), {
        ...options,
        headers,
    });
}

/** Update a ticket through the authenticated REST API. */
export function patchTicket(id, updates) {
    return authenticatedFetch(`/tickets/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
}

/**
 * Reads a JSON response and raises the API's own message on failure, so a
 * rejected call never looks like a silent no-op to the caller.
 */
export async function readJson(res) {
    const body = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(body?.message || `Request failed (${res.status}).`);
    }

    return body;
}

/** Admin approve/reject. PATCH /tickets/:id deliberately ignores this field. */
export function moderateTicket(id, action) {
    return authenticatedFetch(
        `/tickets/${encodeURIComponent(id)}/verification`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        }
    ).then(readJson);
}

/** Admin advertise toggle, capped at six live advertisements. */
export function setTicketAdvertisement(id, isAdvertised) {
    return authenticatedFetch(
        `/tickets/${encodeURIComponent(id)}/advertisement`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAdvertised }),
        }
    ).then(readJson);
}

export function setUserRole(id, role) {
    return authenticatedFetch(`/users/${encodeURIComponent(id)}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
    }).then(readJson);
}

export function setUserFraud(id, isFraud) {
    return authenticatedFetch(`/users/${encodeURIComponent(id)}/fraud`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFraud }),
    }).then(readJson);
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Reads a picked file as a data URL for the upload endpoint. */
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("The image could not be read."));
        reader.readAsDataURL(file);
    });
}

/**
 * Uploads ticket imagery through the API, which holds the imgBB key. The
 * server caps size and MIME type, so the client check is only to fail fast.
 */
export async function uploadImage(file) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Choose an image file.");
    }

    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Images must be 5 MB or smaller.");
    }

    const image = await fileToDataUrl(file);
    const res = await authenticatedFetch("/uploads/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name: file.name }),
    });

    return readJson(res);
}
