import { getProductBySlug, getProductsByCategory } from '@/lib/products';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ productSlug: string; category: string }> }) {
    const { productSlug, category } = await params;
    const product = getProductBySlug(productSlug);

    if (!product) {
        return notFound();
    }

    // Basic upsell logic: other products from the same category
    const allInCategory = getProductsByCategory(category);
    const upsell = allInCategory.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <ProductDetail product={product} upsellProducts={upsell} />
    );
}
