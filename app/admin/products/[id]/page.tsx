import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        notFound();
    }

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
                    <h1 className="font-serif text-2xl text-charcoal">Modifier le produit</h1>
                    <p className="text-xs uppercase tracking-widest text-charcoal/60 mt-1 font-mono text-[10px]">{product.id}</p>
                </div>
            </header>

            <ProductForm categories={categories} initialData={product} />
        </div>
    );
}
