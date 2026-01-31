import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'gold' | 'charcoal' | 'nude';
}

export const Badge = ({ children, variant = 'gold' }: BadgeProps) => {
    const variants = {
        gold: "bg-gold text-white",
        charcoal: "bg-charcoal text-off-white",
        nude: "bg-nude text-charcoal"
    };

    return (
        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-tighter font-bold shadow-sm ${variants[variant]}`}>
            {children}
        </span>
    );
};
