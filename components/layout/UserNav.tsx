'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User } from 'lucide-react';

export const UserNav = () => {
    const { data: session } = useSession();

    return (
        <Link
            href={session ? "/profile" : "/login"}
            className="p-2 hover:text-gold transition-colors relative group"
        >
            <User
                size={20}
                strokeWidth={1.5}
                className={session ? "text-charcoal group-hover:text-gold" : "text-charcoal/80 group-hover:text-gold"}
                fill={session ? "currentColor" : "none"}
            />
            {session && (
                <span className="absolute top-2 right-1 w-1.5 h-1.5 bg-green-500 rounded-full border border-white" />
            )}
        </Link>
    );
};
