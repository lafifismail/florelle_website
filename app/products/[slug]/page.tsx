import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import ProductGallery from '@/components/product/ProductGallery';
import { ProductActions } from '@/components/product/ProductActions';
import RelatedProducts from '@/components/product/RelatedProducts';
import { getProductReviews, getReviewStats } from '@/lib/actions/reviews';
import StarRating from '@/components/ui/StarRating';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
        },
    });

    if (!product) {
        return null;
    }

    return product;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // Fetch Review Stats
    const reviewStats = await getReviewStats(product.id);
    const reviews = await getProductReviews(product.id);

    // Parse tags
    let tags: string[] = [];
    try {
        if (product.tags) {
            tags = JSON.parse(product.tags);
        }
    } catch {
        tags = [];
    }

    // Calculate prices
    const displayPrice = product.salePrice || product.price;
    const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);
    const discountPercent = hasDiscount && product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-off-white">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <nav className="flex items-center gap-2 text-sm text-charcoal/60">
                        <Link href="/" className="hover:text-gold transition-colors">
                            Accueil
                        </Link>
                        <span>/</span>
                        <Link href={`/shop/${product.category.slug}`} className="hover:text-gold transition-colors">
                            {product.category.name}
                        </Link>
                        <span>/</span>
                        <span className="text-charcoal">{product.name}</span>
                    </nav>
                </div>

                {/* Product Detail */}
                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Images Gallery */}
                        <div className="md:sticky md:top-24 h-fit">
                            <ProductGallery
                                images={product.images}
                                productName={product.name}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Category */}
                            <div>
                                <Link
                                    href={`/shop/${product.category.slug}`}
                                    className="text-xs uppercase tracking-widest text-gold font-medium hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            </div>

                            {/* Product Name */}
                            <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating and Price */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2" title={`${reviewStats.average.toFixed(1)}/5`}>
                                    <StarRating rating={reviewStats.average} size={16} />
                                    <span className="text-xs text-charcoal/50">({reviewStats.count} avis)</span>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <div className="text-3xl font-bold text-charcoal">
                                        {displayPrice.toFixed(0)} MAD
                                    </div>
                                    {hasDiscount && (
                                        <div className="text-xl text-charcoal/40 line-through">
                                            {product.price.toFixed(0)} MAD
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.stock > 0 ? (
                                    <>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-charcoal/70">
                                            En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-sm text-red-600 font-medium">Épuisé</span>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-charcoal/80 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-white text-xs uppercase tracking-wider text-charcoal/60 rounded-full border border-charcoal/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <ProductActions
                                product={{
                                    id: product.id,
                                    slug: product.slug,
                                    name: product.name,
                                    price: product.price,
                                    salePrice: product.salePrice,
                                    image: (() => {
                                        try {
                                            const imgs = Array.isArray(product.images) ? product.images : JSON.parse(product.images as string);
                                            return imgs[0] || '/images/placeholder-product.jpg';
                                        } catch {
                                            return '/images/placeholder-product.jpg';
                                        }
                                    })(),
                                    stock: product.stock
                                }}
                                categorySlug={product.category.slug}
                            />

                            {/* Additional Info */}
                            <div className="pt-6 space-y-4 border-t border-charcoal/10">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">Livraison gratuite</p>
                                        <p className="text-xs text-charcoal/60">Dès 400 MAD (Zone 1) ou 600 MAD (Zone 2)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">Produits authentiques</p>
                                        <p className="text-xs text-charcoal/60">100% originaux et garantis</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">Paiement sécurisé</p>
                                        <p className="text-xs text-charcoal/60">Plusieurs moyens de paiement</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reviews Section */}
            <section className="py-16 bg-white border-t border-beige/20" id="reviews">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="mb-8">
                                <h3 className="font-serif text-2xl mb-2 text-charcoal">Avis Clients</h3>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-5xl font-serif text-gold">{reviewStats.average.toFixed(1)}</span>
                                    <div className="flex flex-col">
                                        <StarRating rating={reviewStats.average} size={24} />
                                        <span className="text-sm text-charcoal/50 uppercase tracking-widest mt-1">{reviewStats.count} avis</span>
                                    </div>
                                </div>
                            </div>
                            <ReviewList reviews={reviews} />
                        </div>
                        <div>
                            <ReviewForm productId={product.id} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            <RelatedProducts
                currentProductId={product.id}
                categoryId={product.categoryId}
            />

            <Footer />
            <WhatsAppButton />
        </div>
    );
}
