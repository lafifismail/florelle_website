'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        if (!session) {
            router.push('/login');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="font-serif text-2xl text-charcoal">Panier</h2>
                    <button onClick={closeCart} className="text-charcoal hover:text-gold transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12 text-charcoal/50">
                            <p>Votre panier est vide</p>
                            <button
                                onClick={closeCart}
                                className="mt-4 text-gold hover:underline text-sm uppercase tracking-wider"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-20 h-24 bg-off-white rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-serif text-lg leading-tight">{item.product.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-charcoal/40 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-sm text-charcoal/60 mt-1">
                                            {(item.product.salePrice || item.product.price).toFixed(0)} MAD
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-charcoal/20 rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gold/10 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gold/10 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t bg-off-white/50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm uppercase tracking-wider font-medium">Total</span>
                            <span className="text-2xl font-bold font-serif">{cartTotal.toFixed(0)} MAD</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="block w-full bg-charcoal text-white text-center py-4 uppercase tracking-widest text-sm font-medium hover:bg-gold transition-luxury"
                        >
                            Commander
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
