const DASHBOARD_PATHS = {
    admin: "/dashboard/admin-dashboard",
    vendor: "/dashboard/vendor-dashboard",
    traveller: "/dashboard/user-dashboard",
    // Rows written before the traveller rename still carry the old value.
    user: "/dashboard/user-dashboard",
};

/**
 * Return the dashboard landing page that corresponds to an account role.
 * Unknown roles safely use the traveller dashboard.
 */
export function getDashboardPath(role) {
    return DASHBOARD_PATHS[String(role || "").toLowerCase()] || DASHBOARD_PATHS.traveller;
}
