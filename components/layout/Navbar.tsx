import React from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/layout/UserNav';
import { SearchBar } from '@/components/layout/SearchBar';
import { getShopStructure } from '@/lib/products';
import { CartButton } from '@/components/ui/CartButton';
import { User, Instagram, LayoutDashboard, ShoppingBag, Package, Users, Star } from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MobileMenu } from '@/components/layout/MobileMenu';

export const Navbar = async () => {
    const structure = getShopStructure();
    const categories = Object.keys(structure);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    // ...

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-beige/20 h-16 flex items-center px-4 md:px-12 justify-between">
            <div className="flex items-center gap-4 md:gap-8">
                <MobileMenu isAdmin={isAdmin} />
                <Link href="/" className="block">
                    <img
                        src="/logo.png"
                        alt="Florelle Maroc"
                        className="h-8 md:h-10 w-auto object-contain"
                    />
                </Link>

                {isAdmin && (
                    <div className="hidden md:flex items-center gap-1 border-l border-beige/20 pl-4">
                        <Link href="/admin" title="Dashboard" className="p-2 text-charcoal/60 hover:text-gold transition-colors hover:bg-beige/10 rounded-full">
                            <LayoutDashboard size={18} />
                        </Link>
                        <Link href="/admin/products" title="Produits" className="p-2 text-charcoal/60 hover:text-gold transition-colors hover:bg-beige/10 rounded-full">
                            <ShoppingBag size={18} />
                        </Link>
                        <Link href="/admin/orders" title="Commandes" className="p-2 text-charcoal/60 hover:text-gold transition-colors hover:bg-beige/10 rounded-full">
                            <Package size={18} />
                        </Link>
                        <Link href="/admin/users" title="Clients" className="p-2 text-charcoal/60 hover:text-gold transition-colors hover:bg-beige/10 rounded-full">
                            <Users size={18} />
                        </Link>
                        <Link href="/admin/reviews" title="Avis" className="p-2 text-charcoal/60 hover:text-gold transition-colors hover:bg-beige/10 rounded-full">
                            <Star size={18} />
                        </Link>
                    </div>
                )}
            </div>

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
                <div className="hidden md:flex items-center gap-4 mr-2 border-r border-beige/20 pr-6">
                    <Link
                        href="https://www.tiktok.com/@florelle.maroc"
                        target="_blank"
                        className="text-charcoal hover:text-gold hover:scale-110 transition-all duration-300"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                    </Link>
                    <Link
                        href="https://www.instagram.com/florelle_maroc/"
                        target="_blank"
                        className="text-charcoal hover:text-gold hover:scale-110 transition-all duration-300"
                    >
                        <Instagram size={18} strokeWidth={1.5} />
                    </Link>
                </div>

                <SearchBar />
                <UserNav />
                <CartButton />
            </div>
        </nav>
    );
};



const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);
