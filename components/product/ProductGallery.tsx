'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: any; // Can be array or string from Prisma Json type
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    // Parse images safely
    let imageUrls: string[] = [];
    try {
        if (Array.isArray(images)) {
            imageUrls = images;
        } else if (typeof images === 'string') {
            imageUrls = JSON.parse(images);
        }
    } catch {
        imageUrls = [];
    }

    // Use placeholder if no images
    const finalImages = imageUrls.length > 0 ? imageUrls : ['/images/placeholder-product.jpg'];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const mainImage = finalImages[selectedIndex];
    const hasMultipleImages = finalImages.length > 1;

    // Navigation functions
    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? finalImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === finalImages.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
        setSelectedIndex(index);
    };

    // Autoplay effect - only if multiple images
    useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000); // Change image every 5 seconds

        // Cleanup on unmount or when selectedIndex changes (user interaction)
        return () => clearInterval(interval);
    }, [selectedIndex, hasMultipleImages]); // Reset timer when user changes image

    return (
        <div className="space-y-4">
            {/* Main Image with Navigation Arrows */}
            <div className="relative aspect-square bg-off-white border border-beige/20 rounded-sm overflow-hidden group">
                {/* Stacked Images for Cross-Fade Effect */}
                {finalImages.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt={`${productName} - Image ${index + 1}`}
                        fill
                        className={`object-contain p-4 transition-opacity duration-700 ease-in-out ${selectedIndex === index
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0'
                            }`}
                        priority={index === 0} // Only prioritize first image
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                        }}
                    />
                ))}

                {/* Navigation Arrows - only show if multiple images */}
                {hasMultipleImages && (
                    <>
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            aria-label="Image précédente"
                        >
                            <ChevronLeft className="text-charcoal" size={24} />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            aria-label="Image suivante"
                        >
                            <ChevronRight className="text-charcoal" size={24} />
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {finalImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleThumbnailClick(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index
                                        ? 'bg-gold w-6'
                                        : 'bg-white/60 hover:bg-white/80'
                                        }`}
                                    aria-label={`Aller à l'image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails - only show if multiple images */}
            {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-3">
                    {finalImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative aspect-square bg-white border rounded-sm overflow-hidden transition-all ${selectedIndex === index
                                ? 'border-gold border-2 ring-2 ring-gold/20'
                                : 'border-beige/20 hover:border-gold/50'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${productName} - Image ${index + 1}`}
                                fill
                                className="object-contain p-2"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-product.jpg';
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
                <p className="text-center text-xs text-charcoal/40 uppercase tracking-widest">
                    Image {selectedIndex + 1} sur {finalImages.length}
                </p>
            )}
        </div>
    );
}
