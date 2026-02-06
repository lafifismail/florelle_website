'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Data for the reels
const REELS = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    cover: `/social/reel-${i + 1}-cover.png`,
    video: `/social/reel-${i + 1}-preview.mp4`,
    href: 'https://www.instagram.com/florelle_maroc/',
}));

const SocialCard = ({ reel }: { reel: typeof REELS[0] }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startVideo = () => {
        setIsHovering(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay might be blocked, ignore error
            });
        }
    };

    const stopVideo = () => {
        setIsHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        // Clear any pending timeout
        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
            touchTimeoutRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        startVideo();
    };

    const handleMouseLeave = () => {
        stopVideo();
    };

    // Mobile touch handlers - video starts after touching for 300ms
    const handleTouchStart = () => {
        touchTimeoutRef.current = setTimeout(() => {
            startVideo();
        }, 300);
    };

    const handleTouchEnd = () => {
        stopVideo();
    };

    return (
        <a
            href={reel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-[9/16] rounded-xl overflow-hidden group bg-gray-100 active:scale-95 transition-transform duration-150"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {/* Static Cover Image */}
            <Image
                src={reel.cover}
                alt="Instagram Reel"
                fill
                className={`object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 768px) 40vw, 20vw"
            />

            {/* Video Element (Desktop Only behavior handled via hover state, but element exists) */}
            <video
                ref={videoRef}
                src={reel.video}
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Overlay Gradient & Play Icon (Visible when not playing) */}
            <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                    <Play size={16} className="text-white fill-white ml-1" />
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            <Instagram className="absolute bottom-3 right-3 text-white w-5 h-5 opacity-80" />
        </a>
    );
};

export const SocialWall = () => {
    return (
        <section className="py-24 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="font-serif text-3xl md:text-5xl text-charcoal">ON PARLE DE NOUS</h2>
                    <div className="w-12 h-[1px] bg-gold mx-auto" />
                    <p className="text-xs uppercase tracking-widest text-charcoal/50">Rejoignez la communauté @florelle_maroc & @florelle.maroc</p>
                </div>

                {/* Grid / Carousel Container */}
                <div className="
                    flex overflow-x-auto snap-x gap-4 pb-8 -mx-4 px-4 
                    md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0
                    scrollbar-hide
                ">
                    {REELS.map((reel) => (
                        <div key={reel.id} className="min-w-[40vw] md:min-w-0 snap-center">
                            <SocialCard reel={reel} />
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link href="https://www.instagram.com/florelle_maroc/" target="_blank" className="w-full md:w-auto">
                        <Button className="w-full bg-charcoal text-white hover:bg-[#E30039] px-8 py-6 h-auto text-xs md:text-sm tracking-widest">
                            <Instagram className="mr-2 w-4 h-4" />
                            SUIVRE @FLORELLE_MAROC
                        </Button>
                    </Link>
                    <Link href="https://www.tiktok.com/@florelle.maroc" target="_blank" className="w-full md:w-auto">
                        <Button variant="outline" className="w-full border-charcoal text-charcoal hover:bg-black hover:text-white px-8 py-6 h-auto text-xs md:text-sm tracking-widest">
                            {/* Simple text or icon if available, using text as fallback for icon availability */}
                            <svg className="mr-2 w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.9-6.9V8a8.16 8.16 0 0 0 3.33 1.3V6.69z" /></svg>
                            SUIVRE SUR TIKTOK
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
