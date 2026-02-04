import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStepper } from '@/components/orders/OrderStepper';
import { OrderStatusSelect } from '../OrderStatusSelect';
import Link from 'next/link';
import { Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import DeliveryNoteButton from '@/components/admin/DeliveryNoteButton';

interface AdminOrderDetailsProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminOrderDetailsPage({ params }: AdminOrderDetailsProps) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
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

    const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};

    return (
        <div className="space-y-8 bg-off-white min-h-screen">
            {/* Navbar Admin (Assurez-vous qu'elle gère le mobile ou utilisez le Layout) */}

            <div className="px-4 md:px-0 max-w-6xl mx-auto pb-12">

                {/* Header with Navigation and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                        <Link href="/admin/orders" className="text-xs text-gold uppercase tracking-widest hover:underline mb-2 block">
                            &larr; Retour aux commandes
                        </Link>
                        <h1 className="text-3xl font-serif text-charcoal">Commande #{order.id.slice(-6).toUpperCase()}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>{new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center w-full md:w-auto">
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <DeliveryNoteButton order={order} />
                        </div>

                        {/* STATUT BLOCK - CORRECTION MOBILE */}
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-beige/20 flex flex-col md:flex-row items-center justify-center gap-3 w-full md:w-auto">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest text-center w-full md:w-auto">Statut :</span>
                            <div className="w-full md:w-auto flex justify-center">
                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Column: Client Info & Shipping */}
                    <div className="space-y-8">
                        {/* Client Card */}
                        <div className="bg-white p-6 shadow-sm rounded-sm border border-beige/10 flex flex-col items-center md:items-start text-center md:text-left w-full">
                            <h3 className="font-serif text-lg mb-4 pb-2 border-b border-beige/10 flex items-center justify-center md:justify-start gap-2 w-full">
                                <User size={18} className="text-gold" />
                                Client
                            </h3>
                            <div className="space-y-3 text-sm w-full flex flex-col items-center md:items-start">
                                <p className="font-bold text-charcoal">{order.user?.name || shippingAddress.fullName || 'Invité'}</p>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                    <Mail size={14} />
                                    <a href={`mailto:${order.user?.email}`} className="hover:text-gold transition-colors">{order.user?.email}</a>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                    <Phone size={14} />
                                    <span>{shippingAddress.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white p-6 shadow-sm rounded-sm border border-beige/10 flex flex-col items-center md:items-start text-center md:text-left w-full">
                            <h3 className="font-serif text-lg mb-4 pb-2 border-b border-beige/10 flex items-center justify-center md:justify-start gap-2 w-full">
                                <MapPin size={18} className="text-gold" />
                                <span className="text-charcoal">Livraison</span>
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 w-full flex flex-col items-center md:items-start">
                                <p className="font-medium text-charcoal">{shippingAddress.fullName}</p>
                                <p>{shippingAddress.address}</p>
                                <p>{shippingAddress.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Items & Tracking */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Live Tracking Preview */}
                        <div className="bg-white p-8 shadow-sm rounded-sm border border-beige/10">
                            <h3 className="font-serif text-lg mb-6 text-charcoal text-center md:text-left">Aperçu Suivi Client</h3>
                            <OrderStepper status={order.status} />
                        </div>

                        {/* Items Table */}
                        <div className="bg-white shadow-sm rounded-sm border border-beige/10 overflow-hidden">
                            {/* Wrapper for horizontal scroll only on table body if needed, but we keep full width */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-header-group">
                                        <tr>
                                            <th className="p-4">Produit</th>
                                            <th className="p-4 text-center">Prix</th>
                                            <th className="p-4 text-center">Qté</th>
                                            <th className="p-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="flex flex-col items-center text-center p-4 border-b border-gray-100 md:table-row md:text-left md:p-0">
                                                <td className="p-2 md:p-4 flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                                                    <div className="w-16 h-16 md:w-10 md:h-10 bg-gray-50 rounded border border-beige/20 flex-shrink-0 flex items-center justify-center overflow-hidden mb-2 md:mb-0">
                                                        {item.product.images && Array.isArray(item.product.images) && (
                                                            <img
                                                                src={(item.product.images as string[])[0]}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-contain p-1"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-charcoal">{item.product.name}</span>
                                                </td>
                                                {/* Mobile: Show labels for Price/Qty */}
                                                <td className="p-1 md:p-4 text-center text-gray-600 whitespace-nowrap w-full md:w-auto">
                                                    <span className="md:hidden text-xs text-gray-400 uppercase mr-2">PU:</span>
                                                    {item.price.toFixed(0)} MAD
                                                </td>
                                                <td className="p-1 md:p-4 text-center text-gray-600 w-full md:w-auto">
                                                    <span className="md:hidden text-xs text-gray-400 uppercase mr-2">Qté:</span>
                                                    {item.quantity}
                                                </td>
                                                <td className="p-1 md:p-4 md:text-right font-medium text-charcoal whitespace-nowrap w-full md:w-auto">
                                                    <span className="md:hidden text-xs text-gray-400 uppercase mr-2">Total:</span>
                                                    {(item.price * item.quantity).toFixed(0)} MAD
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* FOOTER TOTALS - CORRECTION CENTRAGE MOBILE */}
                                    <tfoot className="bg-gray-50/50">
                                        {/* Sous-total */}
                                        <tr className="flex flex-col items-center justify-center py-2 md:table-row">
                                            <td colSpan={3} className="p-1 md:p-4 pb-0 md:pb-4 text-center md:text-right font-medium text-gray-400 uppercase tracking-widest text-xs w-full block md:table-cell">
                                                Sous-total
                                            </td>
                                            <td className="p-1 md:p-4 text-center md:text-right text-gray-600 font-medium w-full block md:table-cell whitespace-nowrap">
                                                {(order.totalAmount - (order.shippingFee || 0)).toFixed(0)} MAD
                                            </td>
                                        </tr>

                                        {/* Livraison */}
                                        <tr className="flex flex-col items-center justify-center py-2 md:table-row">
                                            <td colSpan={3} className="p-1 md:p-4 pt-0 text-center md:text-right font-medium text-gold uppercase tracking-widest text-xs w-full block md:table-cell">
                                                Livraison
                                            </td>
                                            <td className="p-1 md:p-4 pt-0 text-center md:text-right text-gold font-medium w-full block md:table-cell whitespace-nowrap">
                                                {order.shippingFee === null ? 'INCLUS' : (order.shippingFee === 0 ? 'OFFERTE' : `${order.shippingFee.toFixed(0)} MAD`)}
                                            </td>
                                        </tr>

                                        {/* Total Final */}
                                        <tr className="flex flex-col items-center justify-center py-4 border-t border-gray-200 md:table-row">
                                            <td colSpan={3} className="p-2 md:p-4 text-center md:text-right font-bold text-charcoal uppercase tracking-widest text-xs w-full block md:table-cell">
                                                Total
                                            </td>
                                            <td className="p-2 md:p-4 text-center md:text-right font-serif text-xl text-charcoal font-bold w-full block md:table-cell whitespace-nowrap">
                                                {order.totalAmount.toFixed(0)} MAD
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
