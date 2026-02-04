'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export function CartButton() {
    const { cartCount, openCart } = useCart();

    return (
        <button onClick={openCart} className="p-2 relative hover:text-gold transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="absolute top-0 right-0 bg-gold text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
            </span>
        </button>
    );
}
