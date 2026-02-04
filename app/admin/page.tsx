import { prisma } from "@/lib/prisma";
import { DollarSign, Clock, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' as any } }
    });
    const revenue = revenueResult._sum.totalAmount || 0;

    const pendingOrders = await prisma.order.count({
        where: { status: 'PENDING' as any }
    });

    const lowStock = await prisma.product.count({
        where: { stock: 0 }
    });

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <header className="flex items-center justify-between border-b border-beige/20 pb-6">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Tableau de Bord</h1>
                    <p className="text-xs uppercase tracking-widest text-gold mt-2 font-bold">Vue d'ensemble</p>
                </div>
                <div className="text-xs text-charcoal/40 text-right hidden md:block">
                    <p>Dernière mise à jour</p>
                    <p className="font-mono">{new Date().toLocaleDateString()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Chiffre d'Affaires"
                    value={`${revenue.toFixed(0)} MAD`}
                    icon={<DollarSign size={24} className="text-gold" />}
                    border="border-gold/30"
                    bg="bg-gold/5"
                />
                <KpiCard
                    title="Commandes en attente"
                    value={pendingOrders}
                    icon={<Clock size={24} className="text-blue-500" />}
                    border="border-blue-200"
                    bg="bg-blue-50"
                />
                <KpiCard
                    title="Rupture de Stock"
                    value={lowStock}
                    icon={<AlertCircle size={24} className="text-red-500" />}
                    border="border-red-200"
                    bg="bg-red-50"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-8 shadow-sm border border-beige/20 rounded-sm min-h-[300px] flex flex-col">
                    <h3 className="font-serif text-xl border-b border-beige/10 pb-4 mb-4">Activité récente</h3>
                    <div className="flex-grow flex items-center justify-center text-charcoal/40 text-xs uppercase tracking-widest">
                        Graphique des ventes (Bientôt)
                    </div>
                </div>
                <div className="bg-white p-8 shadow-sm border border-beige/20 rounded-sm min-h-[300px] flex flex-col">
                    <h3 className="font-serif text-xl border-b border-beige/10 pb-4 mb-4">Actions Rapides</h3>
                    <div className="flex-grow flex items-center justify-center text-charcoal/40 text-xs uppercase tracking-widest">
                        Gestion du site (Bientôt)
                    </div>
                </div>
            </div>
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
