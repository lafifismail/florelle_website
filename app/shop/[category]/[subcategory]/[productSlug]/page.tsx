import { getProductBySlug, getProductsByCategory } from '@/lib/products';
import { getProductBySlug as getProductFromDB } from '@/lib/actions';
import { getProductReviews, getReviewStats } from '@/lib/actions/reviews';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { notFound } from 'next/navigation';
import { StickyAddToCart } from '@/components/shop/StickyAddToCart';

export default async function ProductPage({ params }: { params: Promise<{ productSlug: string; category: string }> }) {
    const { productSlug, category } = await params;
    const product = getProductBySlug(productSlug);

    if (!product) {
        return notFound();
    }

    // Hybrid approach: Fetch DB product for ID & Reviews
    const dbProduct = await getProductFromDB(productSlug);

    let reviews: any[] = [];
    let reviewStats = { average: 0, count: 0 };

    if (dbProduct) {
        reviews = await getProductReviews(dbProduct.id);
        reviewStats = await getReviewStats(dbProduct.id);
    }

    // Basic upsell logic: other products from the same category
    const allInCategory = getProductsByCategory(category);
    const upsell = allInCategory.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <>
            <ProductDetail
                product={product}
                upsellProducts={upsell}
                dbProductId={dbProduct?.id || ""}
                reviews={reviews}
                reviewStats={reviewStats}
            />
            <StickyAddToCart product={product} />
        </>
    );
}
