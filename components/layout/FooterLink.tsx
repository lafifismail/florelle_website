'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    external?: boolean;
}

export const FooterLink = ({ href, children, className = '', external = false }: FooterLinkProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleInteraction = () => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200);
    };

    const linkProps = {
        onTouchStart: handleInteraction,
        onMouseDown: handleInteraction,
        onMouseUp: () => setIsPressed(false),
        onMouseLeave: () => setIsPressed(false),
        className: `
            relative transition-all duration-150
            active:text-gold active:scale-95
            ${isPressed ? 'text-gold scale-95' : 'hover:text-gold'}
            ${className}
        `.trim()
    };

    const underline = (
        <span
            className={`
                absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-150
                ${isPressed ? 'w-full' : 'w-0'}
            `}
        />
    );

    if (external) {
        return (
            <Link href={href} target="_blank" rel="noopener noreferrer" {...linkProps}>
                {children}
                {underline}
            </Link>
        );
    }

    return (
        <Link href={href} {...linkProps}>
            {children}
            {underline}
        </Link>
    );
};
