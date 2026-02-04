'use client';

import React from 'react';
import Link from 'next/link';
import { useCart, CartProduct } from '@/context/CartContext';

interface ProductActionsProps {
    product: CartProduct;
    categorySlug: string;
}

export function ProductActions({ product, categorySlug }: ProductActionsProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="space-y-3 pt-4">
            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 font-sans font-medium text-sm uppercase tracking-wider transition-luxury ${product.stock > 0
                        ? 'bg-charcoal text-white hover:bg-gold hover:border-gold border-2 border-transparent'
                        : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                    }`}
            >
                {product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
            </button>

            <Link
                href={`/shop/${categorySlug}`}
                className="block w-full py-4 text-center border-2 border-charcoal text-charcoal font-sans font-medium text-sm uppercase tracking-wider hover:bg-charcoal hover:text-white transition-luxury"
            >
                Voir la collection
            </Link>
        </div>
    );
}
