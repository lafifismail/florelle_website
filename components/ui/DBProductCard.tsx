'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import StarRating from './StarRating';

// Type pour les produits de la base de données
export interface DBProduct {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    salePrice: number | null;
    images: any; // Json type from Prisma (can be array or string)
    stock: number;
    featured: boolean;
    tags: string | null; // JSON string
    category: {
        id: string;
        name: string;
        slug: string;
    };
    reviews?: { rating: number }[];
}

interface DBProductCardProps {
    product: DBProduct;
}

export const DBProductCard = ({ product }: DBProductCardProps) => {
    const [isPressed, setIsPressed] = useState(false);

    // Parse images - handle Json type (array), legacy string format, and double-serialization
    let imagesData = product.images;
    try {
        // Keep parsing if it's a string that looks like a JSON array or a double-serialized string
        while (typeof imagesData === 'string' && (imagesData.startsWith('[') || imagesData.startsWith('"'))) {
            imagesData = JSON.parse(imagesData);
        }
    } catch {
        imagesData = [];
    }

    const imageUrls = Array.isArray(imagesData) ? imagesData : [];

    // Use first image or placeholder
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : '/images/placeholder-product.jpg';

    // Calculate display price
    const displayPrice = product.salePrice || product.price;
    const hasDiscount = product.salePrice && product.salePrice < product.price;

    // Calculate Rating
    const reviewCount = product.reviews?.length || 0;
    const averageRating = reviewCount > 0
        ? product.reviews!.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block h-full flex flex-col"
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setTimeout(() => setIsPressed(false), 200)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
        >
            <div className={`
                relative aspect-square overflow-hidden bg-stone-50 mb-4 flex items-center justify-center p-6
                transition-all duration-200 active:scale-95 active:shadow-sm
                ${isPressed ? 'scale-95 shadow-lg rounded-lg' : ''}
            `}>
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={80}
                    className={`
                        object-contain transition-all duration-300
                        ${isPressed ? 'scale-90' : 'group-hover:scale-110'}
                    `}
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                    }}
                />

                {/* Discount badge */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Promo
                    </div>
                )}

                {/* Out of stock badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-charcoal font-serif text-lg border border-charcoal px-4 py-2">Épuisé</span>
                    </div>
                )}
            </div>


            <div className="space-y-2 flex-grow flex flex-col">
                <p className="text-[10px] uppercase tracking-widest text-gold font-medium">
                    {product.category.name}
                </p>

                <h3 className={`
                    font-serif text-lg leading-tight transition-all duration-200 line-clamp-2 h-12
                    ${isPressed ? 'text-gold' : 'group-hover:text-gold'}
                `}>
                    {product.name}
                </h3>

                <div className="h-4">
                    {reviewCount > 0 && (
                        <div className="flex gap-1 items-center">
                            <StarRating rating={averageRating} size={12} />
                            <span className="text-[10px] text-charcoal/40">({reviewCount})</span>
                        </div>
                    )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-transparent group-hover:border-beige/20 transition-colors">
                    <div className="flex items-center gap-2">
                        <p className={`text-sm font-sans ${hasDiscount ? 'text-gold font-bold' : 'text-charcoal/80'}`}>
                            {displayPrice.toFixed(0)} MAD
                        </p>
                        {hasDiscount && (
                            <p className="text-xs font-sans text-charcoal/40 line-through">
                                {product.price.toFixed(0)} MAD
                            </p>
                        )}
                    </div>
                    {/* Add to cart icon on hover could go here, for now keeping it clean as requested */}
                </div>
            </div>
        </Link>
    );
};

