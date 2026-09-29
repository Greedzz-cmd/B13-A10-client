import TicketsPage from "@/components/TicketsPage";

export const metadata = {
    title: "All tickets | Routely",
};

const ITEMS_PER_PAGE = 9;

const SORT_VALUES = ["price-asc", "price-desc", "departing-soon", "newest"];
const TRANSPORT_VALUES = ["All", "Flight", "Train", "Bus", "Launch"];
const FARE_VALUES = ["All", "Economy", "Business", "First"];

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
const buildCatalogueUrl = (apiUrl, filters) => {
    const url = new URL("/tickets", apiUrl);

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let tickets = [];
    let pagination = EMPTY_PAGINATION;
    let locations = { from: [], to: [] };

    if (apiUrl) {
        try {
            const [catalogue, locationResponse] = await Promise.all([
                fetch(buildCatalogueUrl(apiUrl, filters), { cache: "no-store" }),
                fetch(`${apiUrl}/tickets/locations`, { cache: "no-store" }),
            ]);

            if (catalogue.ok) {
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
            } else {
                console.error(`Catalogue request failed with status ${catalogue.status}`);
            }

            if (locationResponse.ok) {
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
