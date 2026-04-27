"use client";

import React, { useEffect, useRef, useState } from "react";

interface SpotlightBackgroundProps {
    isChatActive?: boolean;
}

export const SpotlightBackground = ({ isChatActive = false }: SpotlightBackgroundProps) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[-1] overflow-hidden bg-black transition-all duration-1000"
        >
            {/* Bottom Layer: Sharp Image */}
            <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isChatActive ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    backgroundImage: "url('/logo_in_dark_mode.png')",
                    // Inverse Masking: visible at cursor (shows sharp), transparent elsewhere (hides sharp)
                    // Disable mask when chat is active (effectively hidden by opacity anyway, but good for perf)
                    maskImage: isChatActive ? 'none' : `radial-gradient(circle 225px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 100%)`,
                    WebkitMaskImage: isChatActive ? 'none' : `radial-gradient(circle 225px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 100%)`
                }}
            />

            {/* Top Layer: Blurred Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-1000"
                style={{
                    backgroundImage: "url('/logo_in_dark_mode.png')",
                    // When chat is active: Heavy blur (60px), Darker (0.4).
                    // When chat is inactive: Standard blur (30px), Brighter (0.7).
                    filter: isChatActive ? "blur(60px) brightness(0.4)" : "blur(30px) brightness(0.7)",
                    // When chat is active: No mask (show everywhere).
                    // When chat is inactive: Spotlight mask.
                    maskImage: isChatActive ? 'none' : `radial-gradient(circle 225px at ${mousePos.x}px ${mousePos.y}px, transparent 15%, black 100%)`,
                    WebkitMaskImage: isChatActive ? 'none' : `radial-gradient(circle 225px at ${mousePos.x}px ${mousePos.y}px, transparent 15%, black 100%)`
                }}
            />

            {/* Optional: Overlay to darken background further if needed for text contrast */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
    );
};
