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
                                    <div className="space-y-4">
                                        {user.orders.map((order: any) => (
                                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-beige/10 rounded hover:border-gold/30 transition-colors group">
                                                <div className="space-y-1 mb-2 sm:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-charcoal/40">#{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusStyles(String(order.status))}`}>
                                                            {getStatusLabel(String(order.status))}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-charcoal/60">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-MA', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                                    <p className="font-serif font-bold text-charcoal">
                                                        {order.totalAmount.toFixed(0)} MAD
                                                    </p>
                                                    <Button variant="outline" className="text-xs py-2 h-auto hidden group-hover:flex">
                                                        Détails
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
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
