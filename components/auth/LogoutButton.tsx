'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
    const { clearCart } = useCart();

    const handleLogout = async () => {
        clearCart();
        await signOut({ callbackUrl: '/' });
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors uppercase tracking-widest text-xs font-bold rounded-sm mt-4"
            title="Se déconnecter de la session"
        >
            <LogOut size={16} />
            Se déconnecter
        </button>
    );
};
