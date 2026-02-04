import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import Image from "next/image";
import { Pagination } from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import { CategoryFilter } from "@/components/admin/CategoryFilter";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

// On force le rendu dynamique pour que la recherche se mette à jour instantanément
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    await requireAdmin();

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const filter = typeof resolvedSearchParams.filter === 'string' ? resolvedSearchParams.filter : '';
    const search = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : '';
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';

    const limit = 10;
    const skip = (page - 1) * limit;

    // Construction de la requête de filtre
    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search } }, // Recherche insensible à la casse
            { description: { contains: search } },
        ];
    }

    if (category && category !== 'all') {
        where.category = {
            name: category
        };
    }

    if (filter === 'low-stock') {
        where.stock = {
            lte: 9
        };
    }

    // Récupération des données (Produits + Total pour pagination)
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        }),
        prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-8 animate-in fade-in">

            {/* --- NOUVEAU HEADER ORGANISÉ EN 3 ÉTAGES --- */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-sm shadow-sm border border-beige/20">

                {/* ÉTAGE 1 : Titre et Compteur */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h1 className="font-serif text-3xl text-charcoal">Produits</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-gold">{total}</span> produits trouvés
                        </p>
                    </div>
                </div>

                {/* ÉTAGE 2 : Barre de Recherche (Isolée et Pleine Largeur) */}
                <div className="w-full">
                    <SearchInput placeholder="Rechercher un produit (nom, description)..." />
                </div>

                {/* ÉTAGE 3 : Filtres et Bouton Ajouter */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-4">
                    {/* Filtres à gauche */}
                    <div className="w-full sm:w-auto">
                        <CategoryFilter />
                    </div>

                    {/* Bouton Ajouter à droite */}
                    <Link
                        href="/admin/products/new"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-3 rounded-md hover:bg-gold transition-colors duration-300 font-medium text-sm"
                    >
                        <Plus size={18} />
                        Ajouter un produit
                    </Link>
                </div>
            </div>

            {/* --- TABLEAU DES PRODUITS --- */}
            <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">
                {/* Scroll horizontal activé pour mobile */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[1000px]">
                        <thead className="bg-off-white border-b border-beige/20 text-charcoal/60 uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="p-4 font-normal">Image</th>
                                <th className="p-4 font-normal">Nom</th>
                                <th className="p-4 font-normal">Catégorie</th>
                                <th className="p-4 font-normal">Prix</th>
                                <th className="p-4 font-normal">Stock</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige/10">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Aucun produit trouvé. Essayez une autre recherche.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    // Ajout de 'group' pour gérer l'affichage des boutons au survol (PC) vs tout le temps (Mobile)
                                    <tr key={product.id} className="group hover:bg-off-white/50 transition-colors">
                                        <td className="p-4">
                                            <div className="h-12 w-12 rounded bg-gray-100 border border-beige/20 overflow-hidden flex items-center justify-center">
                                                {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                                                    <Image
                                                        src={product.images[0] as string}
                                                        alt={product.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-charcoal">{product.name}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-off-white text-charcoal/70 border border-beige/20 capitalize">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gold">{product.price.toFixed(0)} MAD</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' :
                                                product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {product.stock} en stock
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {/* Boutons toujours visibles sur mobile, et au survol sur PC */}
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-charcoal hover:bg-off-white rounded-md transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={18} />
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
            </div>

            {/* Pagination en bas */}
            <div className="flex justify-center mt-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
