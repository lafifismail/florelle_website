"use client";

import React, { useState } from 'react';
import { Product, Variant } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

interface ProductDetailProps {
    product: Product;
    upsellProducts: Product[];
}

export const ProductDetail = ({ product, upsellProducts }: ProductDetailProps) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
    const router = useRouter();

    const handleCheckout = () => {
        // In a real app, we'd add to cart state here
        router.push('/checkout');
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-nude/20 relative overflow-hidden">
                        {/* Placeholder for Product Image */}
                        <div className="w-full h-full bg-beige/30 flex items-center justify-center text-gold/30 font-serif text-3xl">
                            {product.name}
                        </div>
                        {product.variants.length > 1 && (
                            <div className="absolute top-4 left-4">
                                <Badge variant="gold">Teinte: {selectedVariant.name}</Badge>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {product.variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`w-20 aspect-square bg-nude/10 border transition-luxury flex-shrink-0 ${selectedVariant.id === v.id ? 'border-gold' : 'border-transparent'}`}
                            >
                                <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-tighter opacity-50 px-1 text-center">
                                    {v.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <header className="mb-8 space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold">{product.category} / {product.subcategory}</p>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">{product.name}</h1>
                        <p className="text-2xl font-sans text-gold-dark">{product.price} MAD</p>
                    </header>

                    <div className="prose prose-sm mb-12 text-charcoal/70 leading-relaxed font-sans">
                        <p>{product.description}</p>
                        <ul className="mt-4 space-y-2 !list-none">
                            {product.features?.map(f => (
                                <li key={f} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                                    <span className="text-[10px] uppercase tracking-widest">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Variant Selector */}
                    {product.variants.length > 1 && (
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Choisir une teinte: <span className="opacity-50 ml-2">{selectedVariant.name}</span></p>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`w-10 h-10 rounded-full border-2 transition-luxury relative group ${selectedVariant.id === v.id ? 'border-charcoal scale-110' : 'border-transparent'}`}
                                        title={v.name}
                                    >
                                        <div
                                            className="absolute inset-0.5 rounded-full shadow-inner"
                                            style={{ backgroundColor: v.colorCode }}
                                        />
                                        {selectedVariant.id === v.id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-charcoal text-off-white flex items-center justify-center rounded-full scale-75">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2"><path d="M20 6L9 17L4 12" /></svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA - Desktop */}
                    <div className="hidden md:block mt-auto space-y-4">
                        <Button variant="primary" fullWidth className="py-5" onClick={handleCheckout}>
                            Commander maintenant
                        </Button>
                        <p className="text-[10px] text-center uppercase tracking-widest opacity-40">Paiement à la livraison | Livraison 24-48h</p>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-beige/20 p-4">
                <Button variant="secondary" fullWidth className="py-4 shadow-xl" onClick={handleCheckout}>
                    Acheter maintenant — {product.price} MAD
                </Button>
            </div>

            {/* Upsell Section */}
            {upsellProducts.length > 0 && (
                <section className="border-t border-beige/20 pt-24 pb-12">
                    <div className="mb-12">
                        <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-2">Le Secret Florelle</p>
                        <h2 className="font-serif text-3xl md:text-4xl">Complétez votre look</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {upsellProducts.map(p => (
                            <div key={p.id} className="group cursor-pointer" onClick={() => router.push(`/shop/${p.category.toLowerCase()}/${p.subcategory.toLowerCase()}/${p.slug}`)}>
                                <div className="aspect-square bg-nude/10 mb-4 group-hover:scale-[1.02] transition-luxury overflow-hidden flex items-center justify-center text-[10px] text-gold/30 uppercase text-center px-4">
                                    {p.name}
                                </div>
                                <h4 className="font-serif text-sm uppercase">{p.name}</h4>
                                <p className="text-xs text-gold">{p.price} MAD</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
