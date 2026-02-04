import { requireAdmin } from "@/lib/adminAuth";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Star,       // Pour les Avis
    ArrowLeft,  // Pour retourner au site
    Menu
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    // Liste des liens pour générer la barre mobile facilement
    const navLinks = [
        { href: "/admin", icon: LayoutDashboard, label: "Dash" },
        { href: "/admin/products", icon: ShoppingBag, label: "Prod" },
        { href: "/admin/orders", icon: Package, label: "Cmd" },
        { href: "/admin/users", icon: Users, label: "Client" },
        { href: "/admin/reviews", icon: Star, label: "Avis" },
    ];

    return (
        <div className="flex min-h-screen bg-off-white flex-col lg:flex-row">

            {/* 📱 MOBILE HEADER AMÉLIORÉ (Barre de Navigation Rapide) */}
            <div className="lg:hidden bg-charcoal text-white sticky top-0 z-50 shadow-md flex flex-col">

                {/* Ligne 1 : Logo + Retour Site */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <span className="font-serif text-lg tracking-widest">ADMIN</span>
                    <Link href="/" className="flex items-center gap-2 text-xs text-gold hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        Site
                    </Link>
                </div>

                {/* Ligne 2 : La Barre d'Icônes (Navigation Horizontale) */}
                <div className="flex items-center justify-around p-2 bg-charcoal/95 backdrop-blur overflow-x-auto no-scrollbar">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center justify-center p-2 rounded-lg text-white/60 hover:text-gold hover:bg-white/10 transition-all min-w-[60px]"
                        >
                            <link.icon size={20} />
                            {/* Petit label optionnel en dessous pour la clarté */}
                            {/* <span className="text-[10px] mt-1 uppercase">{link.label}</span> */}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 🖥️ SIDEBAR BUREAU (Inchangée, cachée sur mobile) */}
            <aside className="w-64 bg-charcoal text-white hidden lg:flex flex-col fixed h-full z-50 shadow-2xl">
                <div className="p-8 border-b border-white/10">
                    <h1 className="font-serif text-2xl tracking-widest text-white">FLORELLE</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mt-2 opacity-80">Admin Panel</span>
                </div>

                <nav className="flex-grow p-4 space-y-1 mt-4">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-all text-white/70 hover:text-white hover:pl-5 group">
                            <link.icon size={18} className="group-hover:text-gold transition-colors" />
                            <span className="font-medium">{link.label === "Dash" ? "Tableau de bord" : link.label === "Prod" ? "Produits" : link.label === "Cmd" ? "Commandes" : link.label === "Client" ? "Clients" : "Avis Clients"}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 mb-4">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded transition-colors text-white/50 hover:text-white">
                        <ArrowLeft size={18} />
                        <span>Retour au site</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 lg:ml-64 p-4 md:p-12 overflow-y-auto w-full">
                <div className="max-w-full overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
