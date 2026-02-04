'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CategoryBannerProps {
    bannerPath: string;
    title: string;
}

export default function CategoryBanner({ bannerPath, title }: CategoryBannerProps) {
    const [imageError, setImageError] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Trigger slow zoom animation immediately on mount (with tiny delay for render)
    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            key={bannerPath}
            className="w-full max-w-7xl mx-auto px-4 md:px-12 mt-6 mb-8 group"
        >
            <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden bg-charcoal shadow-2xl">
                {/* Background Image with automatic slow zoom (Ken Burns effect) */}
                {!imageError && (
                    <Image
                        key={`img-${bannerPath}`}
                        src={`${bannerPath}?v=${Date.now()}`}
                        alt={`${title} collection`}
                        fill
                        className={`object-cover transition-transform duration-[20000ms] ease-out ${isAnimated ? 'scale-110' : 'scale-100'}`}
                        priority
                        unoptimized
                        onError={() => setImageError(true)}
                    />
                )}

                {/* Darker overlay for better text contrast - Stronger at top, transparent at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent transition-colors duration-500" />

                {/* White Gradient Fade at the Bottom - Covers bottom edge completely and fades up */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-white from-20% via-white/80 to-transparent pointer-events-none z-10"
                    aria-hidden="true"
                />

                {/* Centered Text Content - Z-index increased to be above white fade */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
                    {/* Small red label */}
                    <p className="text-red-500 text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-3 shadow-sm">
                        Collection {title}
                    </p>

                    {/* Main title - Large white serif */}
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wide drop-shadow-xl">
                        {title}
                    </h1>
                </div>

                {/* Bottom gold accent bar on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </section>
    );
}
