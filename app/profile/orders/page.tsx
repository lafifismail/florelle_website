import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Pagination } from "@/components/admin/Pagination";

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'PENDING':
        case 'PROCESSING':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'SHIPPED':
        case 'DELIVERED':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'CANCELLED':
        case 'FAILED':
            return 'bg-red-50 text-red-600 border-red-100';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        PENDING: 'En attente',
        PROCESSING: 'En cours',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée',
        FAILED: 'Échouée',
        REFUNDED: 'Remboursée'
    };
    return labels[status] || status;
};

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login?callbackUrl=/profile/orders");
    }

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: { user: { email: session.user.email } },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
            skip,
            take: limit,
        }),
        prisma.order.count({
            where: { user: { email: session.user.email } },
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow pt-24 md:pt-32 pb-24 px-4 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-6 relative z-[60]">
                        <Link href="/profile" className="inline-flex items-center py-2 pr-6 -ml-2 text-sm text-charcoal/60 hover:text-gold mb-2 transition-colors font-medium relative z-[70]">
                            <span className="flex items-center"><ArrowLeft size={16} className="mr-2" /> Retour au profil</span>
                        </Link>
                        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Mes Commandes</h1>
                        <p className="text-charcoal/60 text-sm mt-1">Historique complet de vos achats</p>
                    </header>

                    <div className="bg-white p-4 md:p-8 shadow-md border border-beige/30 rounded-sm min-h-[400px]">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-serif text-xl text-charcoal mb-2">Aucune commande</h3>
                                <p className="text-charcoal/60 mb-8 max-w-sm">Vous n'avez pas encore passé de commande. Découvrez notre collection pour commencer votre expérience beauté.</p>
                                <Link href="/">
                                    <Button variant="primary">Découvrir la collection</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-beige/20 rounded-sm hover:border-gold/30 transition-all group bg-off-white/30 hover:bg-white hover:shadow-luxury-hover">
                                            <div className="space-y-2 mb-4 md:mb-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm font-bold text-charcoal">#{order.id.slice(-6).toUpperCase()}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusStyles(String(order.status))}`}>
                                                        {getStatusLabel(String(order.status))}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-charcoal/60">
                                                    <span>{new Date(order.createdAt).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                                                <p className="font-serif font-bold text-lg text-charcoal">
                                                    {order.totalAmount.toFixed(0)} MAD
                                                </p>
                                                <Link
                                                    href={`/profile/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center rounded-sm text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-charcoal/10 bg-transparent hover:bg-gold hover:text-white hover:border-gold h-10 px-4 py-2"
                                                >
                                                    Voir le détail
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-8 pt-6 border-t border-beige/10">
                                        <Pagination totalPages={totalPages} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
