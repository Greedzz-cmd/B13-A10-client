"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    User,
    Ticket,
    CreditCard,
    Plus,
    ClipboardList,
    TicketCheck,
    BarChart3,
    Users,
    Globe,
    LogOut,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    LayoutDashboard,
    Settings,
    Bell,
    Shield,
    FileText,
    Menu,
    X,
    PanelLeft,
} from "lucide-react";

/**
 * Icon resolution helper: handles Lucide components, string names, or custom elements.
 */
const ICON_MAP = {
    user: User,
    profile: User,
    ticket: Ticket,
    bookings: Ticket,
    "my-tickets": ClipboardList,
    tickets: Ticket,
    "credit-card": CreditCard,
    transactions: CreditCard,
    plus: Plus,
    "add-ticket": Plus,
    list: ClipboardList,
    "requested-bookings": TicketCheck,
    chart: BarChart3,
    revenue: BarChart3,
    users: Users,
    globe: Globe,
    advertise: Globe,
    dashboard: LayoutDashboard,
    settings: Settings,
    bell: Bell,
    shield: Shield,
    document: FileText,
};

function renderIcon(icon, className = "h-4 w-4") {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
        return React.cloneElement(icon, {
            className: `${icon.props.className || ""} ${className}`.trim(),
        });
    }
    if (typeof icon === "string" && ICON_MAP[icon.toLowerCase()]) {
        const IconComponent = ICON_MAP[icon.toLowerCase()];
        return <IconComponent className={className} />;
    }
    if (typeof icon === "function" || typeof icon === "object") {
        const IconComponent = icon;
        return <IconComponent className={className} />;
    }
    return null;
}

/**
 * Default preset navigation items by role
 */
export const DEFAULT_SIDEBAR_CONFIG = {
    user: {
        roleLabel: "user",
        variant: "orange",
        items: [
            {
                id: "profile",
                label: "User Profile",
                href: "/dashboard/user-dashboard",
                icon: User,
            },
            {
                id: "booked-tickets",
                label: "My Booked Tickets",
                href: "/dashboard/user-dashboard/bookings",
                icon: Ticket,
            },
            {
                id: "transactions",
                label: "Transaction History",
                href: "/dashboard/user-dashboard/transactions",
                icon: CreditCard,
            },
        ],
    },
    vendor: {
        roleLabel: "vendor",
        variant: "blue",
        items: [
            {
                id: "profile",
                label: "Vendor Profile",
                href: "/dashboard/vendor-dashboard",
                icon: User,
            },
            {
                id: "add-ticket",
                label: "Add Ticket",
                href: "/dashboard/vendor-dashboard/add-ticket",
                icon: Plus,
            },
            {
                id: "added-tickets",
                label: "My Added Tickets",
                href: "/dashboard/vendor-dashboard/my-tickets",
                icon: ClipboardList,
            },
            {
                id: "requested-bookings",
                label: "Requested Bookings",
                href: "/dashboard/vendor-dashboard/requested-bookings",
                icon: TicketCheck,
            },
            {
                id: "revenue",
                label: "Revenue Overview",
                href: "/dashboard/vendor-dashboard/revenue",
                icon: BarChart3,
            },
        ],
    },
    admin: {
        roleLabel: "admin",
        variant: "purple",
        items: [
            {
                id: "profile",
                label: "Admin Profile",
                href: "/dashboard/admin-dashboard",
                icon: User,
            },
            {
                id: "manage-tickets",
                label: "Manage Tickets",
                href: "/dashboard/admin-dashboard/manage-tickets",
                icon: Ticket,
            },
            {
                id: "manage-users",
                label: "Manage Users",
                href: "/dashboard/admin-dashboard/manage-users",
                icon: Users,
            },
            {
                id: "advertise-tickets",
                label: "Advertise Tickets",
                href: "/dashboard/admin-dashboard/advertise-tickets",
                icon: Globe,
            },
        ],
    },
};

/**
 * Color variant styling maps
 */
const VARIANT_STYLES = {
    orange: {
        active: "bg-[#dd7845]/15 text-[#f48a52] border-[#dd7845]/30 shadow-[0_0_15px_rgba(221,120,69,0.08)]",
        activeIcon: "text-[#f48a52]",
        indicator: "bg-[#dd7845]",
        avatarGlow: "group-hover:border-[#dd7845]/40",
    },
    blue: {
        active: "bg-blue-600/15 text-blue-400 border-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.08)]",
        activeIcon: "text-blue-400",
        indicator: "bg-blue-500",
        avatarGlow: "group-hover:border-blue-500/40",
    },
    purple: {
        active: "bg-purple-600/15 text-purple-400 border-purple-500/25 shadow-[0_0_15px_rgba(168,85,247,0.08)]",
        activeIcon: "text-purple-400",
        indicator: "bg-purple-500",
        avatarGlow: "group-hover:border-purple-500/40",
    },
    emerald: {
        active: "bg-emerald-600/15 text-emerald-400 border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.08)]",
        activeIcon: "text-emerald-400",
        indicator: "bg-emerald-500",
        avatarGlow: "group-hover:border-emerald-500/40",
    },
};

/**
 * Utility to extract user initials from a full name
 */
function getInitials(name = "") {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Sidebar Component
 *
 * Highly configurable, reusable sidebar navigation for Admin, Vendor, User dashboards,
 * and arbitrary application pages.
 *
 * @param {Object} props
 * @param {'user' | 'vendor' | 'admin' | 'custom'} [props.role='user'] - Target role preset.
 * @param {Array} [props.items] - Custom menu items [{ id, label, href, icon, badge, onClick, isActive }].
 * @param {Object} [props.user] - User details { name, email, role, avatar, image }.
 * @param {string} [props.activeId] - Explicit active item ID or href (overrides pathname matching).
 * @param {Function} [props.onSelect] - Callback when an item is clicked (id, item, event).
 * @param {Function} [props.onSignOut] - Callback when sign out button is clicked.
 * @param {'orange' | 'blue' | 'purple' | 'emerald'} [props.variant] - Visual accent theme (defaults to role-associated variant).
 * @param {boolean} [props.showHeader=true] - Whether to show the top user profile card.
 * @param {React.ReactNode} [props.header] - Custom header to replace the default user card.
 * @param {boolean} [props.showSignOut=true] - Whether to show the sign out button at the bottom.
 * @param {React.ReactNode} [props.footer] - Custom footer to replace or extend the bottom section.
 * @param {React.ReactNode} [props.bottomContent] - Content placed right above sign out.
 * @param {boolean} [props.collapsible=false] - Whether the sidebar can be collapsed to icon-only mode.
 * @param {boolean} [props.defaultCollapsed=false] - Initial collapsed state if collapsible.
 * @param {boolean} [props.isCollapsed] - Controlled collapsed state.
 * @param {Function} [props.onCollapseToggle] - Controlled collapsed toggle handler.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {boolean} [props.mobileOpen=false] - Whether mobile drawer is visible.
 * @param {Function} [props.onMobileClose] - Handler to close mobile drawer.
 */
export function Sidebar({
    role = "user",
    items,
    user,
    activeId,
    onSelect,
    onSignOut,
    variant,
    showHeader = true,
    header,
    showSignOut = true,
    footer,
    bottomContent,
    collapsible = false,
    defaultCollapsed = false,
    isCollapsed: controlledCollapsed,
    onCollapseToggle,
    className = "",
    showMobileTrigger = true,
    mobileOpen: controlledMobileOpen,
    onMobileOpen,
    onMobileClose,
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);

    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
    const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;

    const handleToggleCollapse = () => {
        if (onCollapseToggle) {
            onCollapseToggle(!isCollapsed);
        } else {
            setInternalCollapsed((prev) => !prev);
        }
    };

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setInternalMobileOpen(false);
    }

    const handleOpenMobile = () => {
        setInternalMobileOpen(true);
        if (onMobileOpen) onMobileOpen();
    };

    const handleCloseMobile = useCallback(() => {
        setInternalMobileOpen(false);
        if (onMobileClose) onMobileClose();
    }, [onMobileClose]);

    // Handle Escape key and body scroll lock for mobile drawer
    useEffect(() => {
        if (!isMobileOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                handleCloseMobile();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobileOpen, handleCloseMobile]);

    // Determine config and fallback items
    const roleConfig = DEFAULT_SIDEBAR_CONFIG[role] || DEFAULT_SIDEBAR_CONFIG.user;
    const resolvedVariant = variant || roleConfig.variant || "orange";
    const variantTheme = VARIANT_STYLES[resolvedVariant] || VARIANT_STYLES.orange;

    // Default user info
    const resolvedUser = {
        name: user?.name || "Nusrat Jahan",
        email: user?.email || "nusrat@example.com",
        role: user?.role || roleConfig.roleLabel,
        avatar: user?.avatar || user?.image,
    };

    // Navigation items
    const navItems = items && items.length > 0 ? items : roleConfig.items;

    // Check if an item is active
    const isItemActive = (item) => {
        if (item.isActive !== undefined) return item.isActive;
        if (activeId !== undefined) {
            return item.id === activeId || item.href === activeId;
        }
        if (!pathname || !item.href) return false;
        // Exact match
        if (pathname === item.href) return true;
        // If there is another sibling item with a more specific href matching the pathname, this one isn't the active one
        const hasMoreSpecificSibling = navItems.some(
            (other) =>
                other.href !== item.href &&
                other.href &&
                (pathname === other.href || pathname.startsWith(other.href + "/")) &&
                other.href.length > item.href.length
        );
        if (hasMoreSpecificSibling) return false;
        // For sub-paths (avoid matching root "/")
        if (item.href !== "/" && pathname.startsWith(item.href + "/")) return true;
        return false;
    };

    const currentActiveItem = navItems.find(isItemActive) || navItems[0];

    const handleSignOut = (e) => {
        if (onSignOut) {
            onSignOut(e);
        } else {
            router.push("/sign-in");
        }
    };

    const renderSidebarContent = (collapsed = false, isMobile = false) => (
        <div className="flex h-full flex-col justify-between p-4">
            {/* Top Container: Header/User card + Navigation links */}
            <div className="flex flex-col gap-6">
                {/* User Profile Card */}
                {showHeader && (
                    header || (
                        <div
                            className={`flex items-center gap-3 transition-all ${
                                collapsed ? "justify-center" : "px-1.5 py-1"
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {resolvedUser.avatar ? (
                                    <Image
                                        src={resolvedUser.avatar}
                                        alt={resolvedUser.name}
                                        width={40}
                                        height={40}
                                        unoptimized
                                        className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111928] text-sm font-semibold tracking-wide text-slate-200 shadow-inner">
                                        {getInitials(resolvedUser.name)}
                                    </div>
                                )}
                            </div>

                            {/* User details */}
                            {!collapsed && (
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-[13.5px] font-semibold text-slate-100">
                                        {resolvedUser.name}
                                    </h4>
                                    <p className="truncate text-xs text-slate-400">
                                        {resolvedUser.email}
                                        {resolvedUser.role ? ` · ${resolvedUser.role}` : ""}
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                )}

                {/* Collapsible toggle button (desktop only) */}
                {collapsible && !isMobile && (
                    <div className="flex justify-end px-1">
                        <button
                            type="button"
                            onClick={handleToggleCollapse}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {collapsed ? (
                                <ChevronRight className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronLeft className="h-3.5 w-3.5" />
                            )}
                        </button>
                    </div>
                )}

                {/* Navigation Items List */}
                <nav className="flex flex-col space-y-1.5" aria-label="Sidebar Navigation">
                    {navItems.map((item, idx) => {
                        const active = isItemActive(item);
                        const itemKey = item.id || item.href || idx;

                        const content = (
                            <>
                                <span
                                    className={`flex-shrink-0 transition-colors ${
                                        active ? variantTheme.activeIcon : "text-slate-400 group-hover:text-slate-200"
                                    }`}
                                >
                                    {renderIcon(item.icon, "h-4 w-4")}
                                </span>

                                {!collapsed && (
                                    <span className="truncate text-[13.5px] font-medium tracking-[-0.01em]">
                                        {item.label}
                                    </span>
                                )}

                                {!collapsed && item.badge !== undefined && (
                                    <span
                                        className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                            active
                                                ? "bg-white/20 text-white"
                                                : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200"
                                        }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </>
                        );

                        const commonClasses = `group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                            collapsed ? "justify-center px-2" : ""
                        } ${
                            active
                                ? `border ${variantTheme.active}`
                                : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        }`;

                        if (item.onClick || !item.href) {
                            return (
                                <button
                                    key={itemKey}
                                    type="button"
                                    onClick={(e) => {
                                        if (item.onClick) item.onClick(e);
                                        if (onSelect) onSelect(item.id || item.href, item, e);
                                        if (isMobile) handleCloseMobile();
                                    }}
                                    className={commonClasses}
                                    title={collapsed ? item.label : undefined}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={itemKey}
                                href={item.href}
                                onClick={(e) => {
                                    if (onSelect) onSelect(item.id || item.href, item, e);
                                    if (isMobile) handleCloseMobile();
                                }}
                                className={commonClasses}
                                title={collapsed ? item.label : undefined}
                                aria-current={active ? "page" : undefined}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Container: Custom Bottom Content + Sign Out */}
            <div className="flex flex-col gap-3 pt-4">
                {bottomContent}

                {footer || (
                    showSignOut && (
                        <div className="border-t border-white/5 pt-3">
                            <button
                                type="button"
                                onClick={(e) => {
                                    if (isMobile) handleCloseMobile();
                                    handleSignOut(e);
                                }}
                                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 ${
                                    collapsed ? "justify-center px-2" : ""
                                }`}
                                title={collapsed ? "Sign out" : undefined}
                                aria-label="Sign out"
                            >
                                <LogOut className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                {!collapsed && (
                                    <span className="text-[13.5px] font-medium tracking-[-0.01em]">
                                        Sign out
                                    </span>
                                )}
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header / Quick Trigger Bar */}
            {showMobileTrigger && (
                <div className="flex w-full items-center justify-between border-b border-white/5 bg-[#080f1d] px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111928] text-xs font-semibold text-slate-200">
                            {getInitials(resolvedUser.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="truncate text-xs font-semibold text-slate-100">
                                {currentActiveItem?.label || resolvedUser.name}
                            </span>
                            <span className="text-[11px] text-slate-400 capitalize">
                                {resolvedUser.role || roleConfig.roleLabel} Dashboard
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenMobile}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
                        aria-label="Open dashboard navigation menu"
                    >
                        <PanelLeft className="h-4 w-4 text-[#dd7845]" />
                        <span>Menu</span>
                    </button>
                </div>
            )}

            {/* Desktop / Default Sidebar */}
            <aside
                className={`hidden md:flex md:flex-col flex-shrink-0 min-h-[calc(100vh-60px)] border-r border-white/5 bg-[#080f1d] text-slate-100 transition-all duration-300 ${
                    isCollapsed ? "w-20" : "w-64"
                } ${className}`}
            >
                {renderSidebarContent(isCollapsed, false)}
            </aside>

            {/* Mobile Drawer Overlay & Slide-in Menu */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                        onClick={handleCloseMobile}
                        aria-hidden="true"
                    />

                    {/* Drawer Content */}
                    <div className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col bg-[#080f1d] shadow-2xl border-r border-white/10">
                        {/* Mobile Drawer Header */}
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {resolvedUser.role || roleConfig.roleLabel} Navigation
                            </span>
                            <button
                                type="button"
                                onClick={handleCloseMobile}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Close sidebar menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Scrollable Sidebar Content */}
                        <div className="flex-1 overflow-y-auto">
                            {renderSidebarContent(false, true)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
