/**
 * Helpers for rendering a user's identity.
 *
 * These were previously duplicated in Sidebar and UserProfile, so a fix to one
 * copy silently left the other stale.
 */

/**
 * Extracts up to two initials from a full name.
 *
 * @param {string} [name=""] - The user's display name.
 * @returns {string} Uppercase initials, or "U" when no name is available.
 */
export function getInitials(name = "") {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Picks the best available avatar URL for a user.
 *
 * Google sign-in populates `image`; `avatar` is accepted too so callers that
 * already hold a normalised user object keep working.
 *
 * @param {Object} [user] - A user or session user.
 * @returns {string|null} An image URL, or null to fall back to initials.
 */
export function getAvatarSrc(user) {
    return user?.avatar || user?.image || null;
}
