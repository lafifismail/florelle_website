import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from '@/components/layout/Navbar';
import { OrderStatusSelect } from './OrderStatusSelect';
import { OrderSearch } from './OrderSearch';
import { Pagination } from '@/components/admin/Pagination';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface AdminOrdersPageProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const { search, page } = await searchParams;
    const query = search || '';
    const currentPage = Number(page) || 1;
    const itemsPerPage = 10;

    const where = {
        OR: [
            { id: { contains: query } },
            { user: { name: { contains: query } } },
            { user: { email: { contains: query } } },
            { shippingAddress: { contains: query } } // Rudimentary JSON string search
        ]
    };

    // Parallel fetch for data and count
    const [orders, totalItems] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: true },
            take: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage,
        }),
        prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="min-h-screen bg-off-white">
            <Navbar />

            <main className="pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal mb-2">Gestion des Commandes</h1>
                        <p className="text-gray-500">Suivi logistique et mises à jour.</p>
                    </div>
                    <div className="w-full md:w-auto md:max-w-sm">
                        <OrderSearch />
                    </div>
                </div>

                <div className="bg-white shadow-luxury rounded-sm overflow-hidden border border-beige/20">
                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Commande</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Montant</th>
                                    <th className="p-4">Livraison</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4 text-center">Détails</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => {
                                    const address = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 md:p-6 font-mono font-medium text-xs whitespace-nowrap">
                                                <Link href={`/admin/orders/${order.id}`} className="hover:text-gold hover:underline block py-2">
                                                    #{order.id.slice(-6).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="p-4 md:p-6 min-w-[200px]">
                                                <div className="font-medium text-charcoal">{order.user?.name || address.fullName || 'Invité'}</div>
                                                <div className="text-xs text-gray-400">{order.user?.email || address.phone}</div>
                                            </td>
                                            <td className="p-4 md:p-6 text-gray-500 text-xs whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-4 md:p-6 font-bold text-charcoal text-right whitespace-nowrap">
                                                {order.totalAmount.toFixed(0)} MAD
                                            </td>
                                            <td className="p-4 md:p-6 text-xs text-gray-500 max-w-[200px] truncate" title={address.city + ', ' + address.address}>
                                                {address.city}
                                            </td>
                                            <td className="p-4 md:p-6 min-w-[180px]">
                                                <OrderStatusSelect
                                                    orderId={order.id}
                                                    currentStatus={order.status}
                                                />
                                            </td>
                                            <td className="p-4 md:p-6 text-center">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    <Eye size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </main>
        </div>
    );
}
