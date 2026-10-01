import TicketsPage from "@/components/TicketsPage";
import { apiBaseUrl, apiUrl } from "@/lib/api-url";

export const metadata = {
    title: "All tickets | Routely",
};

const ITEMS_PER_PAGE = 9;

const SORT_VALUES = ["price-asc", "price-desc", "departing-soon", "newest"];
const TRANSPORT_VALUES = ["All", "Flight", "Train", "Bus", "Launch"];
const FARE_VALUES = ["All", "Economy", "Business", "First"];

/*
 * A serverless API can take a few seconds to wake up, which overruns the default
 * 10s connect budget and surfaces as "fetch failed" even though nothing is wrong
 * with the request. One retry clears the cold start; a real outage still fails
 * fast and falls through to the empty state below.
 */
const fetchWithRetry = async (url, attempts = 2) => {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await fetch(url, {
                cache: "no-store",
                signal: AbortSignal.timeout(20_000),
            });
        } catch (error) {
            if (attempt === attempts) throw error;

            console.warn(`Upstream fetch failed (attempt ${attempt}), retrying:`, url);
        }
    }

    return null;
};

/** Keeps arbitrary query strings from reaching the API. */
const readParam = (value, allowed, fallback) => {
    const first = Array.isArray(value) ? value[0] : value;
    const candidate = String(first ?? "").trim();

    if (!candidate) {
        return fallback;
    }

    if (allowed) {
        const match = allowed.find((option) => option.toLowerCase() === candidate.toLowerCase());
        return match ?? fallback;
    }

    // Free text is length limited so a pasted paragraph cannot become a query.
    return candidate.slice(0, 60);
};

const readPage = (value) => {
    const parsed = Number(Array.isArray(value) ? value[0] : value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

/**
 * Builds the upstream catalogue URL from the browser query string, dropping
 * defaults so shared links stay short.
 */
const buildCatalogueUrl = (base, filters) => {
    const url = new URL("/tickets", base);

    if (filters.from) url.searchParams.set("from", filters.from);
    if (filters.to) url.searchParams.set("to", filters.to);
    if (filters.transport && filters.transport !== "All") {
        url.searchParams.set("transportType", filters.transport);
    }
    if (filters.fare && filters.fare !== "All") {
        url.searchParams.set("fareClass", filters.fare);
    }
    if (filters.query) url.searchParams.set("q", filters.query);
    if (filters.sort) url.searchParams.set("sort", filters.sort);

    url.searchParams.set("page", String(filters.page));
    url.searchParams.set("limit", String(ITEMS_PER_PAGE));

    return url;
};

const EMPTY_PAGINATION = {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
};

/**
 * Loads one page of approved tickets.
 *
 * Every filter is resolved on the server so the catalogue stays correct at any
 * size, and the returned pagination drives the pager instead of slicing the
 * whole catalogue in the browser.
 */
export default async function TicketsRoute({ searchParams }) {
    const params = (await searchParams) || {};

    const filters = {
        from: readParam(params.from),
        to: readParam(params.to),
        transport: readParam(params.transport, TRANSPORT_VALUES, "All"),
        fare: readParam(params.fare, FARE_VALUES, "All"),
        query: readParam(params.q),
        sort: readParam(params.sort, SORT_VALUES, "price-asc"),
        page: readPage(params.page),
    };

    const base = apiBaseUrl();
    let tickets = [];
    let pagination = EMPTY_PAGINATION;
    let locations = { from: [], to: [] };

    if (base) {
        try {
            // Settled rather than all: one flaky upstream should not throw away
            // the other's result, so a catalogue hiccup still fills the dropdowns.
            const [catalogueResult, locationResult] = await Promise.allSettled([
                fetchWithRetry(buildCatalogueUrl(base, filters)),
                fetchWithRetry(apiUrl("/tickets/locations")),
            ]);

            const catalogue = catalogueResult.status === "fulfilled" ? catalogueResult.value : null;
            const locationResponse = locationResult.status === "fulfilled" ? locationResult.value : null;

            if (catalogueResult.status === "rejected") {
                console.error("Failed to fetch tickets from API:", catalogueResult.reason);
            }

            if (catalogue?.ok) {
                const data = await catalogue.json();
                // The API returns a page object; older builds returned a bare array.
                if (Array.isArray(data)) {
                    tickets = data;
                    pagination = {
                        ...EMPTY_PAGINATION,
                        total: data.length,
                    };
                } else if (data && Array.isArray(data.tickets)) {
                    tickets = data.tickets;
                    pagination = { ...EMPTY_PAGINATION, ...data.pagination };
                }
            } else if (catalogue) {
                console.error(`Catalogue request failed with status ${catalogue.status}`);
            }

            if (locationResponse?.ok) {
                locations = await locationResponse.json();
            }
        } catch (error) {
            console.error("Failed to fetch tickets from API:", error);
        }
    }

    return (
        <TicketsPage
            tickets={tickets}
            pagination={pagination}
            locations={locations}
            filters={filters}
            itemsPerPage={ITEMS_PER_PAGE}
        />
    );
}
