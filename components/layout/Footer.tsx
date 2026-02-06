import React from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FooterLink } from './FooterLink';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const Footer = async () => {
    const session = await getServerSession(authOptions);

    return (
        <footer className="bg-charcoal text-off-white py-16 px-4 md:px-12 mt-auto text-center md:text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            alt="Florelle"
                            className="h-10 w-auto object-contain mb-6"
                        />
                    </Link>
                    <p className="text-sm text-off-white/60 leading-relaxed max-w-xs mx-auto md:mx-0">
                        L'excellence italienne au service de la beauté marocaine. Des produits conçus pour sublimer chaque instant.
                    </p>
                    <div className="mt-6">
                        <FooterLink href="/about" className="text-xs font-bold uppercase tracking-widest border-b border-gold pb-1">
                            Notre Histoire
                        </FooterLink>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">SHOP</h4>
                    <ul className="space-y-4 text-xs tracking-widest uppercase">
                        <li><FooterLink href="/shop/eyes">EYES</FooterLink></li>
                        <li><FooterLink href="/shop/lips">LIPS</FooterLink></li>
                        <li><FooterLink href="/shop/face">FACE</FooterLink></li>
                        <li><FooterLink href="/shop/nails">NAILS</FooterLink></li>
                        <li><FooterLink href="/shop/accessories">ACCESSORIES</FooterLink></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Aide</h4>
                    <ul className="space-y-4 text-xs tracking-widest uppercase">
                        <li><FooterLink href="/livraison">Livraison</FooterLink></li>
                        <li><FooterLink href="/contact">Contact</FooterLink></li>
                        <li><FooterLink href="/faq">FAQ</FooterLink></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">VOTRE ESPACE</h4>
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        {session ? (
                            <>
                                <FooterLink href="/profile" className="text-xs tracking-widest uppercase flex items-center gap-2">
                                    <span>Mon Profil</span>
                                    <span className="text-gold">→</span>
                                </FooterLink>
                                <FooterLink href="/profile/orders" className="text-xs tracking-widest uppercase flex items-center gap-2">
                                    <span>Mes Commandes</span>
                                    <span className="text-gold">→</span>
                                </FooterLink>
                            </>
                        ) : (
                            <>
                                <FooterLink href="/login" className="text-xs tracking-widest uppercase flex items-center gap-2">
                                    <span>Se connecter</span>
                                    <span className="text-gold">→</span>
                                </FooterLink>
                                <FooterLink href="/register" className="text-xs tracking-widest uppercase flex items-center gap-2">
                                    <span>Créer un compte</span>
                                    <span className="text-gold">→</span>
                                </FooterLink>
                            </>
                        )}
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-gold">Suivez-nous</h4>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link
                                href="https://www.tiktok.com/@florelle.maroc"
                                target="_blank"
                                className="bg-off-white/10 p-2 rounded-full hover:bg-gold hover:text-white active:bg-gold active:text-white active:scale-95 transition-all duration-150 group"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-off-white group-hover:text-white">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </Link>
                            <Link
                                href="https://www.instagram.com/florelle_maroc/"
                                target="_blank"
                                className="bg-off-white/10 p-2 rounded-full hover:bg-gold hover:text-white active:bg-gold active:text-white active:scale-95 transition-all duration-150 group"
                            >
                                <Instagram size={20} strokeWidth={1.5} className="text-off-white group-hover:text-white" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-off-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] uppercase opacity-40">
                <p>© 2026 FLORELLE. TOUS DROITS RÉSERVÉS.</p>
                <div className="flex gap-6">
                    <FooterLink href="/cgv">CGV</FooterLink>
                    <FooterLink href="/privacy">POLITIQUE DE CONFIDENTIALITÉ</FooterLink>
                </div>
            </div>
        </footer>
    );
};

