import { requireAdmin } from "@/lib/adminAuth";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    ArrowLeft
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <div className="flex min-h-screen bg-off-white">
            {/* Sidebar */}
            <aside className="w-64 bg-charcoal text-white hidden lg:flex flex-col fixed h-full z-50 shadow-2xl">
                <div className="p-8 border-b border-white/10">
                    <h1 className="font-serif text-2xl tracking-widest text-white">FLORELLE</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mt-2 opacity-80">Admin Panel</span>
                </div>

                <nav className="flex-grow p-4 space-y-1 mt-4">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                        <LayoutDashboard size={18} className="group-hover:text-gold transition-colors" />
                        <span className="font-medium">Tableau de bord</span>
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                        <ShoppingBag size={18} className="group-hover:text-gold transition-colors" />
                        <span className="font-medium">Produits</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                        <Package size={18} className="group-hover:text-gold transition-colors" />
                        <span className="font-medium">Commandes</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                        <Users size={18} className="group-hover:text-gold transition-colors" />
                        <span className="font-medium">Clients</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 mb-4">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-colors text-white/50 hover:text-white">
                        <ArrowLeft size={18} />
                        <span>Retour au site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-8 md:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
