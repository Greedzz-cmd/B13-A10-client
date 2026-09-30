"use client";

/**
 * Renders an inline script that the browser runs synchronously while parsing
 * the HTML, so it can correct the DOM before the first paint.
 *
 * React warns whenever a render produces a <script> tag, because scripts
 * inserted via DOM updates never execute on the client. Serving the tag as
 * "text/plain" in the browser makes React's warning disappear while leaving
 * the markup identical on the server, where it must stay executable.
 *
 * This must be a Client Component: a Server Component only ever evaluates
 * during SSR, so the browser branch below would be unreachable and the
 * warning would still fire on hydration.
 *
 * See next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.
 */
export function InlineScript({ html }) {
    return (
        <script
            type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
