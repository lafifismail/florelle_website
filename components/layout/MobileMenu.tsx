'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram } from 'lucide-react';
import Link from 'next/link';

import { createPortal } from 'react-dom';

interface MobileMenuProps {
    isAdmin?: boolean;
}

export const MobileMenu = ({ isAdmin = false }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants = {
        closed: {
            x: "-100%",
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: "0%",
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 40
            }
        }
    };

    const links = [
        { href: '/shop/eyes', label: 'Eyes' },
        { href: '/shop/lips', label: 'Lips' },
        { href: '/shop/face', label: 'Face' },
        { href: '/shop/nails', label: 'Nails' },
        { href: '/shop/accessories', label: 'Accessories' },
        { href: '/about', label: 'Notre Histoire', highlight: true },
    ];

    return (
        <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-charcoal">
                <Menu size={24} />
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleMenu}
                                className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
                            />

                            {/* Menu Panel */}
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[9999] shadow-2xl flex flex-col justify-between h-full font-sans text-black"
                            >
                                <div className="p-4 flex justify-between items-center border-b border-beige/20">
                                    <Link href="/" onClick={toggleMenu}>
                                        <img src="/logo.png" alt="Florelle" className="h-8 w-auto" />
                                    </Link>
                                    <button onClick={toggleMenu} className="p-2 text-charcoal hover:bg-beige/10 rounded-full">
                                        <X size={24} />
                                    </button>
                                </div>

                                <nav className="flex-1 flex-grow overflow-y-auto py-8 px-6 space-y-6">
                                    {isAdmin && (
                                        <div className="mb-8 p-4 bg-off-white/50 rounded-lg border border-gold/20">
                                            <p className="text-xs uppercase tracking-widest text-gold font-bold mb-4">Administration</p>
                                            <div className="space-y-4">
                                                <Link href="/admin/dashboard" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-charcoal font-bold">
                                                    Dashboard
                                                </Link>
                                                <Link href="/admin/products" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-charcoal font-bold">
                                                    Produits
                                                </Link>
                                                <Link href="/admin/orders" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-charcoal font-bold">
                                                    Commandes
                                                </Link>
                                                <Link href="/admin/users" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-charcoal font-bold">
                                                    Utilisateurs
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={toggleMenu}
                                            className={`block text-xl uppercase tracking-widest font-serif ${link.highlight ? 'text-gold' : 'text-black'}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    <div className="w-12 h-[1px] bg-charcoal/10 my-8" />

                                    <Link href="/profile" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-black/60">
                                        Mon Compte
                                    </Link>
                                    <Link href="/contact" onClick={toggleMenu} className="block text-sm uppercase tracking-widest text-black/60">
                                        Contact
                                    </Link>
                                </nav>

                                <div className="p-6 border-t border-beige/20 bg-white">
                                    <div className="flex gap-4 mb-4">
                                        <Link
                                            href="https://www.tiktok.com/@florelle.maroc"
                                            target="_blank"
                                            className="bg-off-white p-2 rounded-full hover:bg-gold hover:text-white transition-all duration-300 border border-beige/20"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href="https://www.instagram.com/florelle_maroc/"
                                            target="_blank"
                                            className="bg-off-white p-2 rounded-full hover:bg-gold hover:text-white transition-all duration-300 border border-beige/20"
                                        >
                                            <Instagram size={20} strokeWidth={1.5} />
                                        </Link>
                                    </div>
                                    <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">
                                        © 2026 FLORELLE BEAUTY
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
