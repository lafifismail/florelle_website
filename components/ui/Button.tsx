import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "px-6 py-3 font-medium transition-luxury relative overflow-hidden flex items-center justify-center gap-2 tracking-wide text-sm uppercase";

    const variants = {
        primary: "bg-charcoal text-off-white hover:bg-gold-dark dark:bg-gold dark:hover:bg-gold-dark",
        secondary: "bg-gold text-white hover:bg-gold-dark shadow-luxury",
        outline: "border border-charcoal text-charcoal hover:bg-charcoal hover:text-off-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-charcoal",
        ghost: "text-charcoal hover:bg-nude/30 dark:text-off-white dark:hover:bg-charcoal/50"
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
