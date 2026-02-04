import React from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/layout/UserNav';
import { getShopStructure } from '@/lib/products';
import { CartButton } from '@/components/ui/CartButton';
import { User } from 'lucide-react';

export const Navbar = () => {
    const structure = getShopStructure();
    const categories = Object.keys(structure);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-beige/20 h-16 flex items-center px-4 md:px-12 justify-between">
            <Link href="/" className="block">
                <img
                    src="/logo.png"
                    alt="Florelle Maroc"
                    className="h-10 w-auto object-contain"
                />
            </Link>

            <div className="hidden md:flex gap-8 items-center h-full">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/shop/${cat.toLowerCase()}`}
                        className="text-xs uppercase tracking-widest hover:text-gold transition-luxury relative group py-2"
                    >
                        {cat}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-luxury group-hover:w-full" />
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {/* Simple icons placeholders */}
                <button className="p-2"><SearchIcon /></button>
                <UserNav />
                <CartButton />
            </div>
        </nav>
    );
};

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);
