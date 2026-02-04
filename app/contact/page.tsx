import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MapPin, Mail, Phone, Instagram } from 'lucide-react';
import Link from 'next/link';
import MapLoader from '@/components/contact/MapLoader';

export const metadata = {
    title: 'Contact | Florelle',
    description: 'Contactez-nous pour toute question sur nos produits ou votre commande.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />

            <main className="flex-grow pt-24">
                {/* Dynamic Map Section */}
                <div className="w-full h-[450px] bg-gray-100 relative overflow-hidden border-b border-gray-200 z-0">
                    <MapLoader />
                </div>

                {/* Content Split */}
                <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Form */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="font-serif text-3xl text-charcoal">NOUS CONTACTER</h2>
                            <p className="text-gray-500 font-light">
                                Une question sur nos produits, une commande ou un partenariat ?<br />
                                Remplissez le formulaire ci-dessous, notre équipe vous répondra sous 24h.
                            </p>
                        </div>

                        <form className="space-y-8">
                            <div className="space-y-6">
                                <div className="group">
                                    <input
                                        type="text"
                                        placeholder="Nom & Prénom *"
                                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="group">
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="group">
                                    <input
                                        type="text"
                                        placeholder="Objet"
                                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="group">
                                    <textarea
                                        placeholder="Votre message..."
                                        rows={5}
                                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors resize-none"
                                        required
                                        suppressHydrationWarning
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#E30039] transition-colors duration-300">
                                Envoyer le message
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-12 lg:pl-12 lg:border-l lg:border-gray-100">
                        <div className="space-y-4">
                            <h2 className="font-serif text-3xl text-charcoal">ADRESSES & RÉSEAUX</h2>
                            <p className="text-gray-500 font-light">
                                Retrouvez-nous à Milan et Casablanca.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {/* Headquarters */}
                            <div className="flex gap-6 items-start group">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal group-hover:bg-black group-hover:text-white transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Florelle Headquarters</h3>
                                    <address className="not-italic text-gray-500 font-light leading-relaxed">
                                        Via Kennedy 4,<br />
                                        20023 Cerro Maggiore,<br />
                                        Milano, Italy
                                    </address>
                                </div>
                            </div>

                            {/* Maroc */}
                            <div className="flex gap-6 items-start group">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal group-hover:bg-[#E30039] group-hover:text-white transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Florelle Maroc</h3>
                                    <address className="not-italic text-gray-500 font-light leading-relaxed">
                                        Boulevard d'Anfa,<br />
                                        20000 Casablanca,<br />
                                        Maroc
                                    </address>
                                </div>
                            </div>

                            {/* Digital Contact */}
                            <div className="flex gap-6 items-start group">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal group-hover:bg-gold group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Service Client Digital</h3>
                                    <div className="text-gray-500 font-light leading-relaxed space-y-1">
                                        <p><a href="mailto:info@florelle.ma" className="hover:text-black transition-colors">info@florelle.ma</a></p>
                                        <p><a href="tel:+212600000000" className="hover:text-black transition-colors">+212 6 XX XX XX XX</a></p>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="font-bold text-xs uppercase tracking-wider mb-6 text-gray-400">Suivez-nous</h3>
                                <div className="flex gap-4">
                                    <Link href="https://www.instagram.com/florelle_maroc/" target="_blank" className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                                        <Instagram size={20} />
                                    </Link>
                                    <Link href="https://www.tiktok.com/@florelle.maroc" target="_blank" className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
