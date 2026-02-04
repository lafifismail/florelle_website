"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions';

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Meknès", "Oujda",
    "Kenitra", "Tétouan", "Safi", "Temara", "Mohammédia", "Salé", "Béni Mellal",
    "El Jadida", "Taza", "Nador", "Settat", "Ksar El Kebir", "Larache", "Guelmim"
];

export default function CheckoutClient() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: '',
        terms: false
    });
    const [submitting, setSubmitting] = useState(false);
    const { cartItems, cartTotal, clearCart } = useCart();

    const shippingCost = cartTotal > 500 ? 0 : 40;
    const finalTotal = cartTotal + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.city || !formData.address || !formData.terms) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setSubmitting(true);

        try {
            const result = await createOrder({
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                shippingDetails: formData
            });

            if (result.success) {
                clearCart();
                localStorage.removeItem('florelle-cart'); // Ensure storage is cleared before redirect
                window.location.href = "/profile";
            }
        } catch (error: any) {
            console.error("Order Error:", error);
            alert("Une erreur est survenue lors de la commande : " + (error.message || "Veuillez réessayer."));
            setSubmitting(false);
        }
    };

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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                                            disabled={submitting}
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
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="flex items-start gap-3 pt-4">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.terms}
                                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                                        className="mt-1 accent-gold"
                                        disabled={submitting}
                                    />
                                    <label htmlFor="terms" className="text-[10px] text-charcoal/60 leading-relaxed uppercase tracking-wider">
                                        J'accepte les conditions générales de vente et la politique de confidentialité.
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="secondary" fullWidth className="py-5 mt-4" disabled={submitting}>
                                {submitting ? "Traitement en cours..." : "Confirmer ma commande"}
                            </Button>
                        </form>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass p-6 space-y-4">
                                <h3 className="font-serif text-xl border-b border-beige/20 pb-4 mb-4">Résumé</h3>

                                {/* Cart Items List */}
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="relative w-12 h-12 bg-white rounded overflow-hidden flex-shrink-0 border border-beige/20">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                                <span className="absolute top-0 right-0 bg-gold text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-bl font-bold">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate text-charcoal uppercase tracking-wider">{item.product.name}</p>
                                                <p className="text-[10px] text-charcoal/60">
                                                    {(item.product.salePrice || item.product.price).toFixed(0)} MAD
                                                </p>
                                            </div>
                                            <div className="text-xs font-medium text-charcoal">
                                                {((item.product.salePrice || item.product.price) * item.quantity).toFixed(0)} MAD
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between text-xs tracking-widest uppercase border-t border-beige/10 pt-4">
                                    <span>Sous-total</span>
                                    <span>{cartTotal.toFixed(0)} MAD</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest uppercase text-gold">
                                    <span>Livraison</span>
                                    <span>{shippingCost === 0 ? 'OFFERTE' : `${shippingCost} MAD`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-serif pt-4 border-t border-beige/20 text-gold-dark">
                                    <span>Total</span>
                                    <span>{finalTotal.toFixed(0)} MAD</span>
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
