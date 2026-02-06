'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

const HERO_IMAGES = [
    '/images/hero/hero-1.jpg.jpg',
    '/images/hero/hero-2.jpg.jpg',
    '/images/hero/hero-3.jpg.jpg',
];

export const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-[75vh] md:h-screen w-full flex items-center justify-center overflow-hidden pt-16">
            {/* Image Slider with Fade Transition */}
            <div className="absolute inset-0 z-0">
                {HERO_IMAGES.map((image, index) => (
                    <div
                        key={image}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Florelle Beauty Hero ${index + 1}`}
                            fill
                            priority
                            quality={85}
                            className="object-cover object-top"
                            sizes="100vw"
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}
                {/* Elegant gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-off-white/40 z-10" />
            </div>

            {/* Floating Text Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-white font-bold drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
                        L'Élégance à l'Italienne
                    </p>
                    <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Florelle <span className="block italic text-gold mt-2">Beauty</span>
                    </h1>
                </div>

                <p className="text-sm md:text-base text-white/90 tracking-wide max-w-lg mx-auto leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    Découvrez une fusion unique entre le luxe italien et la culture beauté du Moyen-Orient. Pour celles qui osent rayonner.
                </p>

                <div className="flex flex-col items-center md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                    <Link href="/shop/eyes">
                        <Button variant="primary" className="min-w-[200px]">Explorer le Regard</Button>
                    </Link>
                    <Link href="/shop/lips">
                        <Button variant="outline" className="min-w-[200px] bg-white/10 backdrop-blur-sm border-white text-white hover:bg-gold hover:text-charcoal hover:border-gold transition-luxury">Sublimer vos Lèvres</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
