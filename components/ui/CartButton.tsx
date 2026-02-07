'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export function CartButton() {
    const { cartCount, openCart } = useCart();
    const [isPressed, setIsPressed] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = () => {
        setIsPressed(true);
        setTimeout(() => {
            openCart();
            setIsPressed(false);
        }, 150);
    };

    return (
        <button
            onClick={handleClick}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setTimeout(() => setIsPressed(false), 200)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`
                p-2 relative rounded-full transition-all duration-150
                active:bg-charcoal active:text-white active:scale-95
                ${isPressed
                    ? 'bg-charcoal text-white scale-95'
                    : 'hover:text-gold'
                }
            `}
            suppressHydrationWarning
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {mounted && (
                <span className={`
                    absolute top-0 right-0 text-[8px] rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-150
                    ${isPressed ? 'bg-white text-charcoal' : 'bg-gold text-white'}
                `}>
                    {cartCount}
                </span>
            )}
        </button>
    );
}
