import { prisma } from '@/lib/prisma';
import { DBProductCard } from '@/components/ui/DBProductCard';

interface RelatedProductsProps {
    currentProductId: string;
    categoryId: string;
}

export default async function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
    // Fetch related products from the same category, excluding current product
    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: categoryId,
            id: {
                not: currentProductId,
            },
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 4, // Limit to 4 related products
    });

    // Don't render section if no related products
    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 md:px-12 bg-off-white border-t border-beige/20">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
                        Vous Aimerez Aussi
                    </h2>
                    <div className="w-12 h-[1px] bg-gold mx-auto" />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                    {relatedProducts.map((product) => (
                        <DBProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
