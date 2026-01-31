"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import Link from 'next/link';

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Meknès", "Oujda",
    "Kenitra", "Tétouan", "Safi", "Temara", "Mohammédia", "Salé", "Béni Mellal",
    "El Jadida", "Taza", "Nador", "Settat", "Ksar El Kebir", "Larache", "Guelmim"
];

export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: '',
        terms: false
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.city || !formData.address || !formData.terms) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center px-4 py-24">
                    <div className="max-w-md w-full text-center space-y-6 animate-in fade-in scale-in-95 duration-500">
                        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-luxury">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <path d="M20 6L9 17L4 12" />
                            </svg>
                        </div>
                        <h1 className="font-serif text-3xl">Merci pour votre commande !</h1>
                        <p className="text-charcoal/60 text-sm leading-relaxed">
                            Votre commande a été reçue avec succès. Nos conseillères vous contacteront par téléphone pour confirmer la livraison.
                        </p>
                        <Link href="/" className="block">
                            <Button variant="outline" fullWidth>Retour à l'accueil</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="pt-24 pb-24 px-4 md:px-12 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="font-serif text-4xl mb-2">Finaliser ma commande</h1>
                        <p className="text-xs uppercase tracking-widest text-gold font-bold">Paiement à la livraison (COD)</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8 bg-white dark:bg-charcoal p-8 shadow-luxury rounded-sm">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Nom complet *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Prénom et Nom"
                                        className="w-full bg-transparent border-b border-beige/40 focus:border-gold outline-none py-2 transition-luxury text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Téléphone *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="06XXXXXXXX"
                                        className="w-full bg-transparent border-b border-beige/40 focus:border-gold outline-none py-2 transition-luxury text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Ville *</label>
                                        <select
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-transparent border-b border-beige/40 focus:border-gold outline-none py-2 transition-luxury text-sm appearance-none"
                                        >
                                            <option value="">Sélectionner une ville</option>
                                            {MOROCCAN_CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Adresse exacte *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Quartier, Rue, Numéro de porte..."
                                        className="w-full bg-transparent border-b border-beige/40 focus:border-gold outline-none py-2 transition-luxury text-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-start gap-3 pt-4">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.terms}
                                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                                        className="mt-1 accent-gold"
                                    />
                                    <label htmlFor="terms" className="text-[10px] text-charcoal/60 leading-relaxed uppercase tracking-wider">
                                        J'accepte les conditions générales de vente et la politique de confidentialité.
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="secondary" fullWidth className="py-5 mt-4">
                                Confirmer ma commande
                            </Button>
                        </form>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass p-6 space-y-4">
                                <h3 className="font-serif text-xl border-b border-beige/20 pb-4">Résumé</h3>
                                <div className="flex justify-between text-xs tracking-widest uppercase">
                                    <span>Sous-total</span>
                                    <span>--- MAD</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest uppercase text-gold">
                                    <span>Livraison</span>
                                    <span>Gratuite</span>
                                </div>
                                <div className="flex justify-between text-lg font-serif pt-4 border-t border-beige/20 text-gold-dark">
                                    <span>Total</span>
                                    <span>--- MAD</span>
                                </div>
                                <p className="text-[8px] text-center uppercase tracking-widest opacity-40 pt-4">
                                    Le montant total sera payé en espèces lors de la réception.
                                </p>
                            </div>

                            <div className="bg-nude/20 p-6 flex items-center gap-4">
                                <div className="bg-gold/10 p-2 rounded-full">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Paiement Sécurisé</p>
                                    <p className="text-[9px] opacity-60 uppercase tracking-tighter">Vérifiez avant de payer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
