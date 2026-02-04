import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Package } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";


export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    await requireAdmin();

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const search = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : '';
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';

    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
        where.OR = [
            { id: { contains: search } }, // Recherche par ID
            { user: { email: { contains: search } } }, // Par email client
            { shippingAddress: { contains: search } }, // Par adresse (si stockée en string)
        ];
    }

    if (status && status !== 'all') {
        where.status = status;
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        }),
        prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-8 animate-in fade-in">

            {/* --- HEADER STYLE MOBILE (3 ÉTAGES) --- */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-sm shadow-sm border border-beige/20">

                {/* ÉTAGE 1 : Titre */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h1 className="font-serif text-3xl text-charcoal">Commandes</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-gold">{total}</span> commandes trouvées
                        </p>
                    </div>
                </div>

                {/* ÉTAGE 2 : Recherche (Pleine Largeur) */}
                <div className="w-full">
                    {/* On utilise SearchInput générique pour avoir le style "Barre Blanche Large" */}
                    <SearchInput placeholder="Rechercher (ID commande, Email client)..." />
                </div>

                {/* ÉTAGE 3 : Filtres (Statut) */}
                <div className="flex flex-col sm:flex-row justify-start items-center gap-4 border-t border-gray-100 pt-4">
                    {/* Liens de filtres rapides */}
                    <div className="flex gap-2 overflow-x-auto w-full pb-2 sm:pb-0">
                        {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                            <Link
                                key={s}
                                href={`/admin/orders?status=${s}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${(status === s || (s === 'all' && !status))
                                        ? 'bg-charcoal text-white border-charcoal'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gold'
                                    }`}
                            >
                                {s === 'all' ? 'Tout' : s}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- TABLEAU COMMANDES (SCROLLABLE) --- */}
            <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[1000px]">
                        <thead className="bg-off-white border-b border-beige/20 text-charcoal/60 uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="p-4 font-normal">Commande</th>
                                <th className="p-4 font-normal">Date</th>
                                <th className="p-4 font-normal">Client</th>
                                <th className="p-4 font-normal">Statut</th>
                                <th className="p-4 font-normal">Total</th>
                                <th className="p-4 font-normal text-right">Détail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige/10">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Aucune commande trouvée.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-off-white/50 transition-colors">
                                        <td className="p-4 font-medium text-charcoal flex items-center gap-2">
                                            <Package size={16} className="text-gold" />
                                            #{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4 text-charcoal/70 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="p-4 text-charcoal font-medium">
                                            {order.user?.name || order.user?.email || "Invité"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-charcoal">
                                            {order.totalAmount.toFixed(0)} MAD
                                        </td>
                                        <td className="p-4 text-right">
                                            {/* Bouton Voir toujours visible sur mobile (opacity-100) */}
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center p-2 bg-off-white text-charcoal hover:bg-gold hover:text-white rounded-md transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
