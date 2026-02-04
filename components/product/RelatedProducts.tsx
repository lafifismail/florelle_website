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
                <div className="flex overflow-x-auto snap-x gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-12 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {relatedProducts.map((product) => (
                        <div key={product.id} className="min-w-[170px] w-[45vw] md:w-auto md:min-w-0 snap-start">
                            <DBProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
