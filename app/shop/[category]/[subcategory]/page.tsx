import { ProductCard } from '@/components/ui/ProductCard';
import { SubCategoryHero } from '@/components/shop/SubCategoryHero';
import { SubCategoryNav } from '@/components/shop/SubCategoryNav';
import { getProductsBySubcategory, getShopStructure } from '@/lib/products';

// Format subcategory name for display
const formatSubcategoryName = (subcategory: string): string => {
    return subcategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default async function SubCategoryPage({
    params,
}: {
    params: Promise<{ category: string; subcategory: string }>;
}) {
    const { category, subcategory } = await params;
    const products = getProductsBySubcategory(category, subcategory);
    const title = formatSubcategoryName(subcategory);

    // Get subcategories for navigation
    const structure = getShopStructure();
    const subcategories = structure[category.toLowerCase()] || [];

    return (
        <>
            {/* Full-width Cinematic Hero Banner - First element, no container */}
            <SubCategoryHero
                category={category}
                subcategory={subcategory}
                title={title}
            />

            {/* Content Section with Container and Padding */}
            <section className="py-12 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Subcategory Filter Navigation */}
                    <SubCategoryNav category={category} subcategories={subcategories} />

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <>
                            <div className="mb-12 text-center">
                                <p className="text-sm text-charcoal/60">
                                    {products.length} {products.length === 1 ? 'produit' : 'produits'} disponible{products.length > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-nude/10 border border-dashed border-beige/40 rounded-lg">
                            <p className="font-serif text-xl opacity-50">
                                Aucun produit trouvé dans cette sous-catégorie.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
