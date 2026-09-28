const DASHBOARD_PATHS = {
    admin: "/dashboard/admin-dashboard",
    vendor: "/dashboard/vendor-dashboard",
    user: "/dashboard/user-dashboard",
    traveller: "/dashboard/user-dashboard",
};

/**
 * Return the dashboard landing page that corresponds to an account role.
 * Unknown roles safely use the standard user dashboard.
 */
export function getDashboardPath(role) {
    return DASHBOARD_PATHS[String(role || "").toLowerCase()] || DASHBOARD_PATHS.user;
}
