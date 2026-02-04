'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CategoryBannerProps {
    bannerPath?: string;
    bannerImages?: string[];
    title: string;
}

export default function CategoryBanner({ bannerPath, bannerImages, title }: CategoryBannerProps) {
    // If bannerImages is provided and has more than 1 image, use slideshow mode
    const images = bannerImages && bannerImages.length > 0 ? bannerImages : [bannerPath || ''];
    const isSlideshow = images.length > 1;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimated, setIsAnimated] = useState(false);

    // Auto-rotate images every 3 seconds
    useEffect(() => {
        if (!isSlideshow) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isSlideshow, images.length]);

    // Trigger slow zoom animation immediately on mount
    useEffect(() => {
        // Reset animation state when index changes to re-trigger zoom if needed, 
        // but for continuous flow, we might want consistent zoom. 
        // The requirement says "Garde l'effet de zoom lent sur chaque image". 
        // So we need to ensure the new image starts zooming.
        setIsAnimated(false);
        const timer = setTimeout(() => setIsAnimated(true), 50);
        return () => clearTimeout(timer);
    }, [currentIndex]); // Re-trigger on slide change

    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-12 mt-6 mb-8 group">
            <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden bg-charcoal shadow-2xl">

                {/* Images Layer - Render all images absolute, opacity controls visibility for cross-fade */}
                {images.map((img, index) => (
                    <div
                        key={`${img}-${index}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={img}
                            alt={`${title} collection - ${index + 1}`}
                            fill
                            className={`object-cover transition-transform duration-[10000ms] ease-out ${index === currentIndex && isAnimated ? 'scale-110' : 'scale-100'}`}
                            priority={index === 0}
                            unoptimized
                        />
                    </div>
                ))}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-white via-white/10 to-transparent pointer-events-none z-10" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
                    <p className="text-red-500 text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-3 drop-shadow-md">
                        Collection {title}
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wide drop-shadow-xl">
                        {title}
                    </h1>
                </div>

                {/* Bottom gold accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </section>
    );
}
