import React from 'react';
import Image from 'next/image';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OrderStepper } from '@/components/orders/OrderStepper';
import Link from 'next/link';

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        notFound();
    }

    // Security check: Ensure order belongs to user
    // Need to fetch user id from email to match order.userId, OR just rely on prisma query if we had joined user.
    // Easier: Fetch user by email first to get ID.
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.id !== order.userId) {
        // Optionally allow admins to view any order? For now strict owner check.
        if (session.user.role !== 'ADMIN') {
            redirect("/profile");
        }
    }

    const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow pt-32 md:pt-24 pb-24 px-4 md:px-12 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                        <Link href="/profile/orders" className="inline-block py-3 pr-6 -ml-2 text-xs text-gold uppercase tracking-widest hover:underline mb-2 font-bold">
                            &larr; Retour à mes commandes
                        </Link>
                        <h1 className="font-serif text-3xl text-charcoal">Commande #{order.id.slice(-6).toUpperCase()}</h1>
                        <p className="text-gray-500 text-sm">Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-serif text-2xl text-charcoal">{order.totalAmount.toFixed(2)} MAD</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Paiement à la livraison</p>
                    </div>
                </div>

                {/* Tracking Stepper */}
                <div className="bg-white p-8 md:p-12 shadow-luxury rounded-sm mb-8 border border-beige/20 order-tracker">
                    <OrderStepper status={order.status} />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-6 shadow-sm rounded-sm border border-beige/10">
                            <h3 className="font-serif text-lg mb-6 pb-2 border-b border-beige/10">Articles ({order.items.length})</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => {
                                    // Robust image parsing
                                    let imageUrl = '/images/placeholder-product.jpg';
                                    try {
                                        if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                                            imageUrl = (item.product.images as string[])[0];
                                        } else if (typeof item.product.images === 'string') {
                                            const parsed = JSON.parse(item.product.images);
                                            if (Array.isArray(parsed) && parsed.length > 0) {
                                                imageUrl = parsed[0];
                                            }
                                        }
                                    } catch (e) {
                                        console.error("Error parsing product image:", e);
                                    }

                                    return (
                                        <div key={item.id} className="flex gap-4 items-start">
                                            <div className="w-16 h-16 bg-gray-50 rounded border border-beige/20 flex-shrink-0 relative overflow-hidden">
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-medium text-charcoal text-sm">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-charcoal text-sm">{(item.price * item.quantity).toFixed(2)} MAD</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-4 border-t border-beige/10 space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span>{(order.totalAmount - (order.shippingFee || 0)).toFixed(2)} MAD</span>
                                </div>
                                <div className="flex justify-between text-xs text-gold uppercase tracking-widest">
                                    <span>Livraison</span>
                                    <span>{order.shippingFee === null ? 'INCLUS' : (order.shippingFee === 0 ? 'OFFERTE' : `${order.shippingFee.toFixed(2)} MAD`)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-serif text-charcoal pt-2 border-t border-dashed border-beige/20">
                                    <span>Total</span>
                                    <span>{order.totalAmount.toFixed(2)} MAD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 shadow-sm rounded-sm border border-beige/10">
                            <h3 className="font-serif text-lg mb-4 pb-2 border-b border-beige/10">Livraison</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-bold text-charcoal">{shippingAddress.fullName}</p>
                                <p>{shippingAddress.address}</p>
                                <p>{shippingAddress.city}</p>
                                <p className="pt-2 text-xs text-gray-400">{shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
