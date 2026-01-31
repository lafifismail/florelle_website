import React from 'react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="bg-charcoal text-off-white py-16 px-4 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            alt="Florelle"
                            className="h-10 w-auto object-contain mb-6"
                        />
                    </Link>
                    <p className="text-sm text-off-white/60 leading-relaxed max-w-xs">
                        L'excellence italienne au service de la beauté marocaine. Des produits conçus pour sublimer chaque instant.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Boutique</h4>
                    <ul className="space-y-4 text-xs tracking-widest uppercase">
                        <li><Link href="/shop/eyes" className="hover:text-gold transition-luxury">Yeux</Link></li>
                        <li><Link href="/shop/lips" className="hover:text-gold transition-luxury">Lèvres</Link></li>
                        <li><Link href="/shop/face" className="hover:text-gold transition-luxury">Visage</Link></li>
                        <li><Link href="/shop/nails" className="hover:text-gold transition-luxury">Ongles</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Aide</h4>
                    <ul className="space-y-4 text-xs tracking-widest uppercase">
                        <li><Link href="#" className="hover:text-gold transition-luxury">Livraison</Link></li>
                        <li><Link href="#" className="hover:text-gold transition-luxury">Retours</Link></li>
                        <li><Link href="#" className="hover:text-gold transition-luxury">Contact</Link></li>
                        <li><Link href="#" className="hover:text-gold transition-luxury">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Newsletter</h4>
                    <p className="text-[10px] uppercase tracking-widest mb-4 opacity-60">Inscrivez-vous pour nos offres exclusives.</p>
                    <div className="flex border-b border-off-white/20 pb-2">
                        <input
                            type="email"
                            placeholder="VOTRE EMAIL"
                            className="bg-transparent text-xs w-full focus:outline-none tracking-widest"
                            suppressHydrationWarning
                        />
                        <button className="text-[10px] font-bold uppercase tracking-widest text-gold">→</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-off-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] uppercase opacity-40">
                <p>© 2026 FLORELLE. TOUS DROITS RÉSERVÉS.</p>
                <div className="flex gap-6">
                    <Link href="#">CGV</Link>
                    <Link href="#">POLITIQUE DE CONFIDENTIALITÉ</Link>
                </div>
            </div>
        </footer>
    );
};
