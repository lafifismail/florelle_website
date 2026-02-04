import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, X } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Navbar } from '@/components/layout/Navbar';

// Helper to safely parse images from Json type
const getMainImage = (images: any) => {
    if (!images) return '/placeholder.jpg';
    try {
        // Images is now Json type from Prisma, could be array directly
        if (Array.isArray(images)) {
            return images.length > 0 ? images[0] : '/placeholder.jpg';
        }
        // Fallback for legacy string data
        if (typeof images === 'string') {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        }
        return '/placeholder.jpg';
    } catch (e) {
        return '/placeholder.jpg';
    }
};

import { CategoryFilter } from "@/components/admin/CategoryFilter";



interface AdminProductsPageProps {
    searchParams: Promise<{
        query?: string;
        page?: string;
        filter?: string;
        category?: string; // Add category to props
    }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
    const { query, page, filter, category } = await searchParams; // Destructure category
    const currentPage = Number(page) || 1;
    const itemsPerPage = 10;
    const isLowStockFilter = filter === 'low-stock';

    // Build Where Clause
    const where: any = {};

    if (query) {
        where.name = {
            contains: query,
        };
    }

    if (isLowStockFilter) {
        where.stock = { lte: 9 };
    }

    // Add Category Filter
    if (category && category !== 'all') {
        where.category = {
            name: category
        };
    }

    // Parallel Fetch: Total Count + Data
    const [totalItems, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }, // ALWAYS sort New -> Old
            take: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage,
            include: { category: true }
        })
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="min-h-screen bg-off-white">
            <Navbar />
            <main className="pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-12">
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-beige/20 pb-6">
                        <div>
                            <h1 className="font-serif text-3xl text-charcoal flex items-center gap-3">
                                Produits
                                {isLowStockFilter && (
                                    <span className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full border border-red-100 flex items-center gap-2">
                                        Rupture de Stock
                                        <Link href="/admin/products" className="hover:text-red-700">
                                            <X size={14} />
                                        </Link>
                                    </span>
                                )}
                                {category && category !== 'all' && (
                                    <span className="text-xs bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/20 flex items-center gap-2">
                                        {category}
                                        <Link href="/admin/products" className="hover:text-gold-darker">
                                            <X size={14} />
                                        </Link>
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs uppercase tracking-widest text-charcoal/60 mt-2">
                                {totalItems} produit{totalItems > 1 ? 's' : ''} trouvé{totalItems > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <SearchInput placeholder="Rechercher un produit..." defaultValue={query} />
                            <CategoryFilter />
                            <Link href="/admin/products/new" className="bg-charcoal text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-2 rounded-sm shadow-md whitespace-nowrap h-[42px]">
                                <Plus size={16} />
                                Ajouter
                            </Link>
                        </div>
                    </header>

                    <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="min-w-[1000px] w-full text-left text-sm">
                                <thead className="bg-charcoal text-white uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Image</th>
                                        <th className="px-6 py-4 font-medium">Nom</th>
                                        <th className="px-6 py-4 font-medium">Catégorie</th>
                                        <th className="px-6 py-4 font-medium">Prix</th>
                                        <th className="px-6 py-4 font-medium">Stock</th>
                                        <th className="px-6 py-4 font-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-beige/10">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-charcoal/40 text-sm">
                                                Aucun produit trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="group hover:bg-off-white/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="relative w-12 h-12 bg-white border border-beige/20 rounded overflow-hidden">
                                                        <Image
                                                            src={getMainImage(product.images)}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-charcoal text-sm">{product.name}</p>
                                                    <p className="text-[10px] text-charcoal/40 font-mono truncate max-w-[150px]">{product.slug}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs bg-beige/10 px-2 py-1 rounded text-charcoal/80">
                                                        {product.category.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-serif text-charcoal">
                                                    {product.price.toFixed(0)} MAD
                                                    {product.salePrice && (
                                                        <span className="ml-2 text-[10px] line-through text-red-400 opacity-60">
                                                            {product.salePrice.toFixed(0)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.stock === 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                                            Épuisé
                                                        </span>
                                                    ) : product.stock < 10 ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-100 uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                                            Faible ({product.stock})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                            En stock ({product.stock})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                                        <Link
                                                            href={`/admin/products/${product.id}`}
                                                            className="p-2 text-charcoal hover:bg-gold/10 hover:text-gold-dark rounded transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Pencil size={18} />
                                                        </Link>
                                                        <DeleteProductButton id={product.id} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-beige/10 bg-gray-50/50">
                                <Pagination totalPages={totalPages} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
