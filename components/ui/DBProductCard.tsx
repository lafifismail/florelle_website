'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Type pour les produits de la base de données
interface DBProduct {
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
}

interface DBProductCardProps {
    product: DBProduct;
}

export const DBProductCard = ({ product }: DBProductCardProps) => {
    // Parse images - handle both Json type (array) and legacy string format
    let imageUrls: string[] = [];
    try {
        if (Array.isArray(product.images)) {
            // Already an array from Json type
            imageUrls = product.images;
        } else if (typeof product.images === 'string') {
            // Legacy string format
            imageUrls = JSON.parse(product.images);
        }
    } catch {
        imageUrls = [];
    }

    // Use first image or placeholder
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : '/images/placeholder-product.jpg';

    // Calculate display price
    const displayPrice = product.salePrice || product.price;
    const hasDiscount = product.salePrice && product.salePrice < product.price;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-off-white mb-4 transition-luxury flex items-center justify-center">
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-luxury"
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                    }}
                />

                {/* Discount badge */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-2 py-1 rounded-sm">
                        PROMO
                    </div>
                )}

                {/* Out of stock badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
                        <span className="text-white font-serif text-lg">Épuisé</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-gold font-medium">
                    {product.category.name}
                </p>
                <h3 className="font-serif text-lg leading-tight group-hover:text-gold transition-luxury line-clamp-2">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-sans ${hasDiscount ? 'text-gold font-bold' : 'text-charcoal/70'}`}>
                        {displayPrice.toFixed(0)} MAD
                    </p>
                    {hasDiscount && (
                        <p className="text-xs font-sans text-charcoal/40 line-through">
                            {product.price.toFixed(0)} MAD
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};
