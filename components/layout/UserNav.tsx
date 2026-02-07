'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User } from 'lucide-react';

export const UserNav = () => {
    const { data: session } = useSession();
    const [isPressed, setIsPressed] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Link
            href={session ? "/profile" : "/login"}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setTimeout(() => setIsPressed(false), 200)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`
                p-2 rounded-full transition-all duration-150 relative group
                active:bg-charcoal active:scale-95
                ${isPressed
                    ? 'bg-charcoal scale-95'
                    : 'hover:text-gold'
                }
            `}
            suppressHydrationWarning
        >
            <User
                size={20}
                strokeWidth={1.5}
                className={`transition-colors duration-150 ${isPressed
                    ? 'text-white'
                    : session
                        ? 'text-charcoal group-hover:text-gold'
                        : 'text-charcoal/80 group-hover:text-gold'
                    }`}
                fill={mounted && session ? "currentColor" : "none"}
            />
            {mounted && session && (
                <span className={`
                    absolute top-2 right-1 w-1.5 h-1.5 rounded-full border transition-colors duration-150
                    ${isPressed ? 'bg-white border-charcoal' : 'bg-green-500 border-white'}
                `} />
            )}
        </Link>
    );
};
