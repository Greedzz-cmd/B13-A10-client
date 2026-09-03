"use client";

import { useState } from "react";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=900&auto=format&fit=crop";
const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop";

export default function TicketImage({
    src,
    alt,
    className = "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
}) {
    const [imgSrc, setImgSrc] = useState(src || DEFAULT_IMAGE);

    return (
        <img
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            src={imgSrc}
        />
    );
}
