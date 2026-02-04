import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Truck, MapPin, Banknote, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
    title: 'Livraison & Expédition | Florelle',
    description: 'Informations sur nos zones de livraison, tarifs et délais d\'expédition partout au Maroc.',
};

export default function LivraisonPage() {
    // Shared card styles for consistency
    const cardClasses = "bg-white p-10 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#E30039] group hover:shadow-md transition-all duration-300";

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 overflow-x-hidden">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60">
                        <Link href="/" className="hover:text-gold transition-colors">
                            Accueil
                        </Link>
                        <span>/</span>
                        <span className="text-charcoal font-medium">Livraison</span>
                    </nav>
                </div>

                {/* Main Content Container - Using Grid for better control */}
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">

                        {/* Left Column: Text Content (Centered in its space) */}
                        <div className="lg:col-span-7 flex flex-col items-center">
                            <div className="w-full max-w-2xl space-y-8">
                                {/* Header - Centered */}
                                <header className="text-center space-y-4 mb-10">
                                    <div className="inline-flex items-center justify-center p-3 bg-[#E30039]/5 rounded-full text-[#E30039] mb-4 lg:hidden">
                                        <Truck size={32} strokeWidth={1.5} />
                                    </div>
                                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal">Expédition & Livraison</h1>
                                    <p className="text-lg text-charcoal/70 font-light italic">
                                        L'excellence italienne livrée chez vous, partout au Maroc.
                                    </p>
                                </header>

                                {/* Zone 1 */}
                                <section className={cardClasses}>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="mt-1">
                                            <MapPin className="text-[#E30039]" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-2xl text-charcoal mb-1">Zone 1 : Grand Casablanca & Mohammédia</h2>
                                            <p className="text-sm text-charcoal/60 uppercase tracking-wider font-medium">Service personnalisé Florelle</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 pl-10">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Clock size={18} className="text-gray-400 mt-0.5" />
                                                <div className="text-sm text-charcoal/80">
                                                    <p className="font-bold text-charcoal mb-2">Jours de Livraison</p>
                                                    <ul className="space-y-2">
                                                        <li className="flex flex-col"><span className="text-xs text-gray-500 uppercase">Samedi - Mardi</span> <span className="font-medium text-[#E30039]">➔ Livrées le MERCREDI</span></li>
                                                        <li className="flex flex-col"><span className="text-xs text-gray-500 uppercase">Mercredi - Vendredi</span> <span className="font-medium text-[#E30039]">➔ Livrées le SAMEDI</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-sm text-center flex flex-col justify-center border border-gray-100">
                                            <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Tarif de livraison</p>
                                            <p className="font-serif text-3xl text-charcoal mb-1">25 MAD</p>
                                            <p className="text-xs text-[#E30039] font-bold uppercase tracking-wider">Offerte dès 400 MAD</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Zone 2 */}
                                <section className={cardClasses}>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="mt-1">
                                            <MapPin className="text-charcoal" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-2xl text-charcoal mb-1">Zone 2 : Partout ailleurs au Maroc</h2>
                                            <p className="text-sm text-charcoal/60 uppercase tracking-wider font-medium">Expédition via transporteur partenaire</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 pl-10">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Clock size={18} className="text-gray-400 mt-0.5" />
                                                <div className="text-sm text-charcoal/80">
                                                    <p className="font-bold text-charcoal mb-2">Fréquence et Délais</p>
                                                    <p className="mb-2">Expédition groupée <span className="font-medium text-charcoal">le Jeudi</span>.</p>
                                                    <p>Réception sous <span className="font-medium text-charcoal">24h à 72h</span> après expédition</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-sm text-center flex flex-col justify-center border border-gray-100">
                                            <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Tarif de livraison</p>
                                            <p className="font-serif text-3xl text-charcoal mb-1">45 MAD</p>
                                            <p className="text-xs text-[#E30039] font-bold uppercase tracking-wider">Offerte dès 600 MAD</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Info */}
                                <section className={cardClasses}>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <Banknote size={24} className="text-charcoal" />
                                        </div>

                                        <div>
                                            <h3 className="font-serif text-2xl text-charcoal mb-2">Paiement à la Livraison</h3>
                                            <p className="text-sm text-charcoal/80 leading-relaxed max-w-xl">
                                                Pour votre sécurité et votre tranquillité d'esprit, nous appliquons exclusivement le paiement à la livraison (Cash on Delivery).
                                                Vous ne réglez votre commande qu'une fois le colis entre vos mains.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* CTA */}
                                <div className="text-center pt-6">
                                    <Link href="/" className="inline-block">
                                        <Button variant="secondary" className="pl-8 pr-6 py-4 text-sm bg-charcoal text-white hover:bg-[#E30039] border-none shadow-none">
                                            Retour à la Boutique
                                            <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image with Decorative Circle - Pushed to right */}
                        <div className="hidden lg:flex lg:col-span-5 relative w-full h-auto justify-end items-center">
                            {/* Decorative Circle - Scaled down slightly */}
                            <div className="absolute w-[400px] h-[400px] bg-orange-50 rounded-full -z-10 right-10 top-1/2 transform -translate-y-1/2"></div>

                            {/* Image - Mirrored & Reduced size */}
                            <img
                                src="/images/woman-lipstick-delivery.png?v=3"
                                alt="Livraison Florelle Maroc"
                                width={450} // Reduced width
                                height={600}
                                className="object-contain drop-shadow-2xl relative z-10 scale-x-[-1]" // Mirrored
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
