import { DBProductCard } from '@/components/ui/DBProductCard';
import { SubCategoryHero } from '@/components/shop/SubCategoryHero';
import { SubCategoryNav } from '@/components/shop/SubCategoryNav';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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

    // Normalize category and subcategory for querying
    const categorySlug = category.replace(/-/g, ' '); // simple normalization
    // Ideally we match by slug in DB, but DB might have 'Lips', 'Eyes'. 
    // Let's try to match by normalized name or slug if available.
    // The previous Shop page capitalized: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    // Fetch products
    const products = await prisma.product.findMany({
        where: {
            category: {
                name: categoryName
            },
            subcategory: {
                contains: subcategory,
            }
        },
        include: {
            category: true,
            reviews: {
                where: { isApproved: true },
                select: { rating: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    const title = formatSubcategoryName(subcategory);

    // Get subcategories for navigation (hardcoded for now to match shop page logic or fetch distinct)
    // Reusing the static list from Shop Page logic would be consistent
    const subcategoryOptions: Record<string, string[]> = {
        'lips': ['Lipstick', 'Gloss', 'Lip Pencil'],
        'eyes': ['Mascara', 'Eyeliners', 'Eyeshadows', 'Pencil'],
        'face': ['Foundation', 'Powder', 'Blushes'],
        'nails': ['Nail Polish', 'Nail Care', 'French Manicure'],
        'accessories': ['Sharpeners']
    };
    const subcategories = subcategoryOptions[category.toLowerCase()] || [];

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
                                    <DBProductCard
                                        key={p.id}
                                        product={{
                                            ...p,
                                            images: p.images as any, // Cast JSON to any
                                            tags: p.tags,
                                            reviews: p.reviews,
                                            category: {
                                                id: p.category.id,
                                                name: p.category.name,
                                                slug: p.category.slug
                                            }
                                        }}
                                    />
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
