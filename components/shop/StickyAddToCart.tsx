'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyAddToCartProps {
    product: any;
}

export const StickyAddToCart = ({ product }: StickyAddToCartProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            // Show only if scrolled down past 500px (roughly where the main button might disappear)
            // and hide if at the very bottom (footer)
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if Main Add to Cart button (which we assume is near top) is out of view
            // Using a simple threshold for now
            if (scrollY > 600 && (scrollY + windowHeight < documentHeight - 100)) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAdd = () => {
        addToCart(product, 1);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-beige/20 p-4 shadow-luxury z-40 flex items-center justify-between"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-charcoal/60 uppercase tracking-widest">{product.name}</span>
                        <span className="font-bold text-charcoal">
                            {(product.salePrice || product.price).toFixed(0)} MAD
                        </span>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="py-3 px-6 text-xs uppercase tracking-widest bg-charcoal text-white hover:bg-gold"
                    >
                        AJOUTER
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
