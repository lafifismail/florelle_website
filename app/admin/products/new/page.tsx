import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <header className="flex items-center gap-4 border-b border-beige/20 pb-6">
                <Link href="/admin/products" className="p-2 hover:bg-white rounded-full transition-colors text-charcoal/50 hover:text-charcoal">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-2xl text-charcoal">Ajouter un produit</h1>
                    <p className="text-xs uppercase tracking-widest text-charcoal/60 mt-1">Nouveau produit au catalogue</p>
                </div>
            </header>

            <ProductForm categories={categories} />
        </div>
    );
}
