/**
 * One-off migration from hard coded colours to the theme tokens in globals.css.
 *
 * The palette was written as ~58 near identical navy hex values plus white and
 * black alpha utilities. That made a light theme impossible, so each literal is
 * rewritten to the token that expresses its role:
 *
 *   navy backgrounds   -> --surface-canvas / -inset / --surface / -raised / -strong
 *   navy borders       -> --line
 *   orange text        -> --accent-ink (darkened in light mode for contrast)
 *   white/black alpha  -> --hairline / --shade (inverted in light mode)
 *
 * Run with: node scripts/migrate-theme-tokens.mjs
 * Already-migrated files are skipped, so it is safe to re-run.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const SRC = new URL("../src/", import.meta.url).pathname;
const UTILITY_PREFIXES = ["bg", "text", "border", "ring", "from", "to", "shadow", "divide", "outline", "fill", "stroke", "decoration", "placeholder", "accent", "caret", "outline"];

const BUCKETS = [
    { max: 0.085, token: "--surface-canvas" },
    { max: 0.12, token: "--surface-inset" },
    { max: 0.16, token: "--surface" },
    { max: 0.21, token: "--surface-raised" },
    { max: Infinity, token: "--surface-strong" },
];

const lightness = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
};

const hue = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) {
        return 0;
    }

    let h;

    if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
        h = ((b - r) / delta + 2) * 60;
    } else {
        h = ((r - g) / delta + 4) * 60;
    }

    return h;
};

const isNavy = (hex) => hue(hex) >= 185 && hue(hex) <= 265 && lightness(hex) < 0.3;
const isOrange = (hex) => hue(hex) >= 10 && hue(hex) <= 45;

/** Picks the surface token for a navy background by how light it is. */
const surfaceToken = (hex) => {
    const l = lightness(hex);
    return BUCKETS.find((bucket) => l < bucket.max).token;
};

const tokenFor = (prefix, hex) => {
    if (prefix === "border" || prefix === "outline" || prefix === "ring") {
        return "--line";
    }

    if (prefix === "text" || prefix === "placeholder") {
        return "--accent-ink";
    }

    return surfaceToken(hex);
};

const walk = (dir) =>
    readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);

        if (entry === "node_modules" || entry === ".next") {
            return [];
        }

        return statSync(full).isDirectory() ? walk(full) : [full];
    });

const files = walk(SRC).filter((file) => [".js", ".jsx", ".ts", ".tsx"].includes(extname(file)));

let changedFiles = 0;
let replacements = 0;
const tokenCounts = new Map();
const orangeBgSkipped = [];

for (const file of files) {
    const original = readFileSync(file, "utf8");

    if (original.includes("var(--surface-canvas)") && !original.includes("#[0-9a-fA-F]{6}")) {
        continue;
    }

    let updated = original;

    // 1. Arbitrary hex utilities -> theme tokens.
    updated = updated.replace(
        new RegExp(
            `\\b(${UTILITY_PREFIXES.join("|")})-\\[(#[0-9a-fA-F]{6})\\]`,
            "g"
        ),
        (match, prefix, rawHex) => {
            const hex = rawHex.toLowerCase();

            if (isNavy(hex)) {
                const token = tokenFor(prefix, hex);
                tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
                return `${prefix}-[var(${token})]`;
            }

            if (prefix === "text" && isOrange(hex)) {
                tokenCounts.set("--accent-ink", (tokenCounts.get("--accent-ink") || 0) + 1);
                return "text-[var(--accent-ink)]";
            }

            if (prefix === "border" && isOrange(hex)) {
                return match;
            }

            orangeBgSkipped.push(`${prefix}-[${hex}]`);
            return match;
        }
    );

    // 2. white/black alpha utilities -> hairline / shade theme colors.
    //    These are used as `border-hairline/10` so the alpha survives, and the
    //    token flips to a dark value in light mode to stay visible.
    updated = updated.replace(
        /\b(bg|text|border|ring|divide|from|to|fill|stroke|outline|placeholder|shadow)-(white|black)\/(\[[^\]]+\]|[0-9.]+)/g,
        (match, prefix, base, alpha) => {
            const token = base === "white" ? "hairline" : "shade";
            tokenCounts.set(`--${token}`, (tokenCounts.get(`--${token}`) || 0) + 1);
            return `${prefix}-${token}/${alpha}`;
        }
    );

    if (updated !== original) {
        writeFileSync(file, updated);
        changedFiles += 1;
        replacements += 1;
    }
}

console.log(`files changed: ${changedFiles}`);
console.log("token usage:", Object.fromEntries([...tokenCounts].sort((a, b) => b[1] - a[1])));
console.log(
    "left as literal (accents / status colours):",
    [...new Set(orangeBgSkipped)].slice(0, 12).join(", ") || "none"
);
