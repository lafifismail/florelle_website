import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DollarSign, Clock, AlertCircle, Package, Star } from "lucide-react";
import PromoSettings from '@/components/admin/PromoSettings';
import { getSiteSettings } from '@/lib/actions/settings';
import { FeaturedProductsManager } from '@/components/admin/FeaturedProductsManager';

export default async function AdminDashboard() {
    // 1. Fetch Key Metrics
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' as any } }
    });
    const revenue = revenueResult._sum.totalAmount || 0;

    const pendingOrders = await prisma.order.count({
        where: { status: 'PENDING' as any }
    });

    const lowStock = await prisma.product.count({
        where: { stock: { lte: 9 } }
    });

    const pendingReviews = await prisma.review.count({
        where: { isApproved: false }
    });

    const siteSettings = await getSiteSettings();

    // Fetch featured products and all products for the manager
    const featuredProducts = await prisma.product.findMany({
        where: { isFeatured: true },
        select: { id: true, name: true, price: true, images: true, isFeatured: true, category: { select: { id: true, name: true } }, subcategory: true }
    });

    const allProducts = await prisma.product.findMany({
        select: { id: true, name: true, price: true, images: true, isFeatured: true, category: { select: { id: true, name: true } }, subcategory: true },
        orderBy: { name: 'asc' }
    });

    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-off-white">

            <main className="px-4 md:px-12 max-w-7xl mx-auto pb-12">
                <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-beige/20 pb-6 gap-4">
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Tableau de Bord</h1>
                            <p className="text-xs uppercase tracking-widest text-gold mt-2 font-bold">Vue d'overview</p>
                        </div>
                        <div className="text-xs text-charcoal/40 text-right hidden md:block">
                            <p>Dernière mise à jour</p>
                            <p className="font-mono">{new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <KpiCard
                            title="Chiffre d'Affaires"
                            value={`${revenue.toFixed(0)} MAD`}
                            icon={<DollarSign size={24} className="text-gold" />}
                            border="border-gold/30"
                            bg="bg-gold/5"
                        />
                        <Link href="/admin/orders?status=PENDING" className="block group">
                            <div className="bg-white p-6 rounded-sm shadow-sm border border-blue-200 flex items-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-2 text-charcoal group-hover:text-blue-600 transition-colors">Commandes en attente</p>
                                    <p className="text-3xl font-serif text-charcoal group-hover:text-blue-700 transition-colors">{pendingOrders}</p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50 relative z-10 group-hover:bg-blue-100 group-hover:shadow-sm transition-all">
                                    <Clock size={24} className="text-blue-500" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/products?filter=low-stock" className="block group">
                            {/* Low Stock Card - Clickable */}
                            <div className="bg-white p-6 rounded-sm shadow-sm border border-red-200 flex items-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-2 text-charcoal group-hover:text-red-500 transition-colors">Rupture de Stock</p>
                                    <p className="text-3xl font-serif text-charcoal group-hover:text-red-600 transition-colors">{lowStock}</p>
                                </div>
                                <div className="p-3 rounded-full bg-red-50 relative z-10 group-hover:bg-red-100 group-hover:shadow-sm transition-all">
                                    <AlertCircle size={24} className="text-red-500" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Actions & Promo (Promo Hidden on Mobile) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:mt-12">
                        {/* Quick Actions - Compressed Layout */}
                        <div className="bg-white p-4 md:p-6 shadow-sm border border-beige/20 rounded-sm flex flex-col order-2 md:order-1">
                            <h3 className="font-serif text-xl border-b border-beige/10 pb-3 mb-3">Actions Rapides</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {/* Compact Link Cards */}
                                <Link href="/admin/reviews" className="flex items-center justify-between p-3 bg-off-white hover:bg-gold/10 rounded-sm border border-transparent hover:border-gold/30 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1.5 rounded-full text-gold group-hover:text-charcoal transition-colors">
                                            <Star size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-charcoal">Gérer les Avis</p>
                                        </div>
                                    </div>
                                    {pendingReviews > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                            {pendingReviews}
                                        </span>
                                    )}
                                </Link>

                                <Link href="/admin/products" className="flex items-center justify-between p-3 bg-off-white hover:bg-gold/10 rounded-sm border border-transparent hover:border-gold/30 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1.5 rounded-full text-charcoal group-hover:text-gold transition-colors">
                                            <Package size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-charcoal">Gérer les Produits</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/admin/orders" className="flex items-center justify-between p-3 bg-off-white hover:bg-gold/10 rounded-sm border border-transparent hover:border-gold/30 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1.5 rounded-full text-blue-500 group-hover:text-gold transition-colors">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-charcoal">Commandes</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Featured Products Manager */}
                                <FeaturedProductsManager
                                    initialFeatured={featuredProducts as any}
                                    allProducts={allProducts as any}
                                    categories={categories}
                                />
                            </div>
                        </div>

                        {/* Promo Settings - HIDDEN ON MOBILE */}
                        <div className="hidden md:flex bg-white p-8 shadow-sm border border-beige/20 rounded-sm min-h-[300px] flex-col order-1 md:order-2">
                            <h3 className="font-serif text-xl border-b border-beige/10 pb-4 mb-4">Gestion Bannière Promo</h3>
                            <PromoSettings initialSettings={siteSettings} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const KpiCard = ({ title, value, icon, border, bg }: any) => (
    <div className={`bg-white p-6 rounded-sm shadow-sm border ${border} flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all cursor-default`}>
        <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500`} />
        <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-2 text-charcoal group-hover:text-gold-dark transition-colors">{title}</p>
            <p className="text-3xl font-serif text-charcoal">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bg} relative z-10 group-hover:bg-white group-hover:shadow-sm transition-all`}>
            {icon}
        </div>
    </div>
);
