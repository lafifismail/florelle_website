import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link
            href={`/shop/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}/${product.slug}`}
            className="group block"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 transition-luxury flex items-center justify-center">
                <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-luxury"
                />

                {product.variants.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {product.variants.slice(0, 4).map((v) => (
                            <div
                                key={v.id}
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: v.colorCode }}
                            />
                        ))}
                        {product.variants.length > 4 && (
                            <span className="text-[10px] text-white bg-charcoal/50 rounded-full px-1">+{product.variants.length - 4}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-gold font-medium">
                    {product.subcategory}
                </p>
                <h3 className="font-serif text-lg leading-tight group-hover:text-gold transition-luxury">
                    {product.name}
                </h3>
                <p className="text-sm font-sans text-charcoal/70 dark:text-off-white/70">
                    {product.price} MAD
                </p>
            </div>
        </Link>
    );
};
