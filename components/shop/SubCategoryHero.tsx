import React from 'react';
import Image from 'next/image';

interface SubCategoryHeroProps {
    category: string;
    subcategory: string;
    title: string;
}

// Map subcategory names to banner file names (handles plural/singular differences)
const getBannerName = (subcategory: string): string => {
    const bannerMap: Record<string, string> = {
        'eyeliners': 'eyeliner',
        'eyeshadows': 'eyeshadows',
        // Add more mappings if needed
    };

    return bannerMap[subcategory] || subcategory;
};

export const SubCategoryHero = ({ category, subcategory, title }: SubCategoryHeroProps) => {
    // Construct dynamic image path with proper banner name
    const bannerName = getBannerName(subcategory);
    const imagePath = `/images/banners/${category}/${category}-${bannerName}.jpg`;

    return (
        <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
            {/* Ken Burns Animation - Animated Background Image */}
            <div className="absolute inset-0 animate-ken-burns">
                <Image
                    src={imagePath}
                    alt={title}
                    fill
                    priority
                    className="w-full h-full object-cover"
                    sizes="100vw"
                />
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center px-4">
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold font-bold">
                        Collection {category}
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight drop-shadow-2xl">
                        {title}
                    </h1>
                    <div className="w-24 h-[2px] bg-gold mx-auto mt-6" />
                </div>
            </div>

            {/* Bottom gradient to blend with content below */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-off-white to-transparent z-10" />
        </section>
    );
};
