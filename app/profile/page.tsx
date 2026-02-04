import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ProfileCard } from '@/components/profile/ProfileCard';
import Link from 'next/link';

// Helper for status styling

// Helper for status styling
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

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login?callbackUrl=/profile");
    }

    const user: any = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!user) {
        // Session valid but user not in DB (rare)
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow pt-24 pb-24 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Mon Espace</h1>
                        <p className="text-charcoal/60 text-sm mt-2">Bienvenue, {user.name || 'Cher client'}</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Profile Card */}
                        {/* Left Column: Profile Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <ProfileCard user={user} />
                        </div>

                        {/* Right Column: Order History */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 shadow-sm border border-beige/20 rounded-sm min-h-[400px]">
                                <h2 className="font-serif text-xl text-charcoal mb-6">Mes Dernières Commandes</h2>

                                {user.orders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center h-64">
                                        <div className="w-12 h-12 bg-off-white rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6 text-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-charcoal/60 mb-6">Votre historique est vide pour le moment.</p>
                                        <Link href="/">
                                            <Button variant="primary">Découvrir la collection</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left min-w-[600px]">
                                                <thead className="bg-off-white border-b border-beige/20 text-charcoal/60 uppercase tracking-widest text-[10px]">
                                                    <tr>
                                                        <th className="p-4 font-normal">N° Commande</th>
                                                        <th className="p-4 font-normal">Date</th>
                                                        <th className="p-4 font-normal">Statut</th>
                                                        <th className="p-4 font-normal text-right">Montant</th>
                                                        <th className="p-4 font-normal text-right">Détails</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-beige/10">
                                                    {user.orders.map((order: any) => (
                                                        <tr key={order.id} className="hover:bg-off-white/50 transition-colors">
                                                            <td className="p-4 font-mono text-xs font-bold text-charcoal/40">
                                                                #{order.id.slice(-6).toUpperCase()}
                                                            </td>
                                                            <td className="p-4 text-sm text-charcoal/80">
                                                                {new Date(order.createdAt).toLocaleDateString('fr-MA', {
                                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusStyles(String(order.status))}`}>
                                                                    {getStatusLabel(String(order.status))}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-serif font-bold text-charcoal">
                                                                {order.totalAmount.toFixed(0)} MAD
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <Link href={`/profile/orders/${order.id}`}>
                                                                    <Button variant="outline" className="text-xs py-1 px-3 h-auto">
                                                                        Voir
                                                                    </Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
