"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Ticket,
    CheckCircle2,
    AlertCircle,
    CreditCard,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getAvatarSrc, getInitials } from "@/lib/user";


/**
 * Default profile configurations, fields, and metrics by role
 */

const fetchTickets = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
            cache: "no-store",
        });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch (err) {
        console.error("Failed to fetch tickets:", err);
    }
    return [];
};

export const DEFAULT_PROFILES = {
    user: {
        title: "User Profile",
        subtitle: "Manage your personal information.",
        statsPosition: "bottom",
        avatarStyle: "border-hairline/10 bg-[var(--surface-inset)] text-slate-200",
        user: {
            name: "Nusrat Jahan",
            email: "Nusrat@Example.Com",
            role: "User",
            phone: "+880 1700 000 000",
            location: "Dhaka, Bangladesh",
            memberSince: "2024",
            avatar: null,
        },
        fields: [
            { label: "FULL NAME", key: "name" },
            { label: "EMAIL", key: "email" },
            { label: "ROLE", key: "role" },
            { label: "PHONE", key: "phone" },
            { label: "LOCATION", key: "location" },
            { label: "MEMBER SINCE", key: "memberSince" },
        ],
        stats: [
            {
                label: "TOTAL BOOKINGS",
                value: "4",
                icon: Ticket,
                iconColor: "text-[var(--accent-ink)]",
                valueColor: "text-slate-100",
            },
            {
                label: "ACCEPTED",
                value: "1",
                icon: CheckCircle2,
                iconColor: "text-emerald-500",
                valueColor: "text-slate-100",
            },
            {
                label: "PENDING",
                value: "1",
                icon: AlertCircle,
                iconColor: "text-amber-500",
                valueColor: "text-slate-100",
            },
            {
                label: "TOTAL PAID",
                value: "৳850",
                icon: CreditCard,
                iconColor: "text-[var(--accent-ink)]",
                valueColor: "text-slate-100",
            },
        ],
    },
    vendor: {
        title: "Vendor Profile",
        subtitle: "",
        statsPosition: "none",
        avatarStyle: "border border-blue-500/20 bg-[var(--surface-inset)] text-blue-400",
        user: {
            name: "Nusrat Jahan",
            email: "nusrat@example.com",
            role: "Vendor",
            totalTickets: "0",
            approved: "0",
            totalRevenue: "৳0",
            avatar: null,
        },
        fields: [
            { label: "FULL NAME", key: "name" },
            { label: "EMAIL", key: "email" },
            { label: "ROLE", key: "role" },
            { label: "TOTAL TICKETS", key: "totalTickets" },
            { label: "APPROVED", key: "approved" },
            { label: "TOTAL REVENUE", key: "totalRevenue" },
        ],
        stats: [],
    },
    admin: {
        title: "Admin Profile",
        subtitle: "",
        statsPosition: "top",
        avatarStyle: "border border-purple-500/25 bg-[var(--surface)] text-purple-300",
        user: {
            name: "Nusrat Jahan",
            email: "Nusrat@Example.Com",
            role: "Administrator",
            platform: "Routely",
            approvedTickets: "11",
            pendingTickets: "1",
            avatar: null,
        },
        fields: [
            { label: "FULL NAME", key: "name" },
            { label: "EMAIL", key: "email" },
            { label: "ROLE", key: "role" },
            { label: "PLATFORM", key: "platform" },
            { label: "APPROVED TICKETS", key: "approvedTickets" },
            { label: "PENDING TICKETS", key: "pendingTickets" },
        ],
        stats: [
            {
                // Static fallback — the live count is merged in at render time
                // inside UserProfile, once `tickets` has loaded from the API.
                label: "TOTAL TICKETS",
                value: "0",
                valueColor: "text-[var(--accent-ink)]",
            },
            {
                label: "PENDING REVIEW",
                value: "1",
                valueColor: "text-amber-400",
            },
            {
                label: "TOTAL USERS",
                value: "6",
                valueColor: "text-teal-400",
            },
            {
                label: "ADVERTISED",
                value: "6 / 6",
                valueColor: "text-purple-300",
            },
        ],
    },
};

/**
 * UserProfile Component
 *
 * Versatile profile and metrics view reusable across User, Vendor, Admin dashboards,
 * and custom account pages.
 *
 * @param {Object} props
 * @param {'user' | 'vendor' | 'admin' | 'custom'} [props.role='user'] - Preconfigured profile role.
 * @param {string} [props.title] - Override title text.
 * @param {string} [props.subtitle] - Override subtitle text.
 * @param {Object} [props.user] - User object to merge or override default values.
 * @param {Array} [props.fields] - Override field definitions [{ label, key, value }].
 * @param {Array} [props.stats] - Override stats items [{ label, value, icon, iconColor, valueColor }].
 * @param {'top' | 'bottom' | 'none'} [props.statsPosition] - Position of stats grid relative to profile fields.
 * @param {string} [props.avatarStyle] - Override avatar card styling.
 * @param {React.ReactNode} [props.extraActions] - Optional buttons or actions in header.
 * @param {string} [props.className] - Additional class names.
 */
export function UserProfile({
    role = "user",
    title,
    subtitle,
    user: customUser,
    fields: customFields,
    stats: customStats,
    statsPosition: customStatsPosition,
    avatarStyle: customAvatarStyle,
    extraActions,
    className = "",
}) {
    const session = useSession();
    const sessionUser = session?.data?.user;
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        let cancelled = false;
        fetchTickets().then((data) => {
            if (!cancelled) {
                setTickets(data);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const advertised = tickets.filter(t => t.isAdvertised == true);
    const pending = tickets.filter(t => t.verificationStatus == "pending");
    const approved = tickets.filter(t => t.verificationStatus == "approved");

    const defaultConfig = DEFAULT_PROFILES[role] || DEFAULT_PROFILES.user;
    const sessionProfile = sessionUser
        ? {
              name: sessionUser.name,
              email: sessionUser.email,
              role: sessionUser.role || defaultConfig.user.role,
              avatar: sessionUser.image || sessionUser.avatar || defaultConfig.user.avatar,
          }
        : {};
    const config = {
        ...defaultConfig,
        user: {
            ...defaultConfig.user,
            ...sessionProfile,
            ...(customUser || {}),
        },
    };

    const resolvedTitle = title !== undefined ? title : config.title;
    const resolvedSubtitle = subtitle !== undefined ? subtitle : config.subtitle;
    const resolvedStatsPosition =
        customStatsPosition !== undefined ? customStatsPosition : config.statsPosition;
    const resolvedAvatarStyle =
        customAvatarStyle !== undefined ? customAvatarStyle : config.avatarStyle;

    const resolvedUser = config.user;

    const resolvedFields = customFields || config.fields;

    // Merge the live ticket count into the static stats config, only for
    // roles/stats that actually track "TOTAL TICKETS".
    const baseStats = customStats || config.stats;
    const resolvedStats = baseStats.map((stat) => {
        if (stat.label === "TOTAL TICKETS") {
            return { ...stat, value: tickets.length }
        }
        if (stat.label === "ADVERTISED") {
            return { ...stat, value: advertised.length }
        }
        if (stat.label === "PENDING REVIEW") {
            return { ...stat, value: pending.length }
        }
        return stat
    });


    const statsGrid = resolvedStats && resolvedStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resolvedStats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={stat.label || idx}
                        className="rounded-xl border border-hairline/5 bg-[var(--surface-inset)] p-4 md:p-5 transition-colors hover:border-hairline/10"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                {stat.label}
                            </span>
                            {IconComponent && (
                                <IconComponent
                                    className={`h-4 w-4 ${stat.iconColor || "text-[var(--accent-ink)]"}`}
                                />
                            )}
                        </div>
                        <div
                            className={`mt-3 font-serif text-2xl md:text-3xl font-semibold ${
                                stat.valueColor || "text-slate-100"
                            }`}
                        >
                            {stat.value}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className={`max-w-6xl space-y-7 ${className}`}>
            {/* Optional Stats on Top (e.g. Admin Profile) */}
            {resolvedStatsPosition === "top" && statsGrid}

            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100">
                        {resolvedTitle}
                    </h1>
                    {resolvedSubtitle && (
                        <p className="mt-1 text-xs text-slate-400">
                            {resolvedSubtitle}
                        </p>
                    )}
                </div>
                {extraActions}
            </div>

            {/* Profile Overview Section */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                {/* Large Avatar Card */}
                <div
                    className={`relative flex h-28 w-28 md:h-32 md:w-32 flex-shrink-0 items-center justify-center rounded-2xl text-3xl md:text-4xl font-serif font-medium shadow-inner overflow-hidden ${
                        resolvedAvatarStyle || "border border-hairline/10 bg-[var(--surface-inset)] text-slate-200"
                    }`}
                >
                    {resolvedUser.avatar ? (
                        <Image
                            src={resolvedUser.avatar}
                            alt={resolvedUser.name || "Avatar"}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    ) : (
                        getInitials(resolvedUser.name)
                    )}
                </div>

                {/* Profile Fields Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resolvedFields.map((field, idx) => {
                        const val =
                            field.value !== undefined
                                ? field.value
                                : resolvedUser[field.key];

                        return (
                            <div
                                key={field.label || field.key || idx}
                                className="rounded-xl border border-hairline/5 bg-[var(--surface-inset)] p-4 md:px-5 md:py-4 transition-colors hover:border-hairline/10"
                            >
                                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    {field.label}
                                </span>
                                <span className="text-sm font-medium text-slate-100">
                                    {val || "—"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Optional Stats on Bottom (e.g. User Profile) */}
            {resolvedStatsPosition === "bottom" && statsGrid}
        </div>
    );
}

export default UserProfile;