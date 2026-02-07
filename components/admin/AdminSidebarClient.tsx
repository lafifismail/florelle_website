'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Star,
    ArrowLeft,
    Lock
} from 'lucide-react';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

interface AdminSidebarProps {
    readonly children: React.ReactNode;
}

export default function AdminSidebarClient({ children }: AdminSidebarProps) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const navLinks = [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dash" },
        { href: "/admin/products", icon: ShoppingBag, label: "Prod" },
        { href: "/admin/orders", icon: Package, label: "Cmd" },
        { href: "/admin/users", icon: Users, label: "Client" },
        { href: "/admin/reviews", icon: Star, label: "Avis" },
    ];

    const labelMap: Record<string, string> = {
        "Dash": "Tableau de bord",
        "Prod": "Produits",
        "Cmd": "Commandes",
        "Client": "Utilisateurs",
        "Avis": "Avis Clients"
    };

    return (
        <>
            <div className="flex min-h-screen bg-off-white flex-col lg:flex-row">

                {/* 📱 MOBILE HEADER */}
                <div className="lg:hidden bg-charcoal text-white sticky top-0 z-[9999] shadow-md flex flex-col">

                    {/* Ligne 1 : Logo + Retour Site */}
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-charcoal relative z-[9999]">
                        <span className="font-serif text-lg tracking-widest">ADMIN</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                aria-label="Changer le mot de passe"
                                className="flex items-center gap-1 text-xs text-white/60 hover:text-gold transition-colors"
                                title="Changer le mot de passe"
                            >
                                <Lock size={14} />
                            </button>
                            <Link href="/" className="flex items-center gap-2 text-xs text-gold hover:text-white transition-colors">
                                <ArrowLeft size={16} />
                                Site
                            </Link>
                        </div>
                    </div>

                    {/* Ligne 2 : La Barre d'Icônes */}
                    <div className="flex items-center justify-around p-2 bg-charcoal/95 backdrop-blur overflow-x-auto no-scrollbar relative z-[9999]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-label={labelMap[link.label] || "Avis Clients"}
                                className="flex flex-col items-center justify-center p-3 rounded-lg text-white/60 hover:text-gold hover:bg-white/10 active:bg-white/20 active:scale-95 active:text-white transition-all min-w-[60px]"
                            >
                                <link.icon size={22} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 🖥️ SIDEBAR BUREAU */}
                <aside className="w-64 bg-charcoal text-white hidden lg:flex flex-col fixed h-full z-50 shadow-2xl">
                    <div className="p-8 border-b border-white/10">
                        <h1 className="font-serif text-2xl tracking-widest text-white">FLORELLE</h1>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mt-2 opacity-80">Admin Panel</span>
                    </div>

                    <nav className="flex-grow p-4 space-y-1 mt-4">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                                <link.icon size={18} className="group-hover:text-gold transition-colors" />
                                <span className="font-medium">
                                    {labelMap[link.label]}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Password Change & Return */}
                    <div className="p-4 border-t border-white/10 space-y-1 mb-4">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            aria-label="Changer le mot de passe"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-colors text-white/50 hover:text-gold"
                        >
                            <Lock size={18} />
                            <span>Mot de passe</span>
                        </button>
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-colors text-white/50 hover:text-white">
                            <ArrowLeft size={18} />
                            <span>Retour au site</span>
                        </Link>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 lg:ml-64 p-4 md:p-12 overflow-y-auto w-full relative z-0">
                    <div className="max-w-full overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <ChangePasswordForm onClose={() => setShowPasswordModal(false)} />
            )}
        </>
    );
}
