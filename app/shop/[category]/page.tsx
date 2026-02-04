import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { DBProductCard } from '@/components/ui/DBProductCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import CategoryBanner from '../../../components/shop/CategoryBanner';

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';

// Subcategory options for navigation
const subcategoryOptions: Record<string, string[]> = {
    'lips': ['Lipstick', 'Gloss', 'Lip Pencil'],
    'eyes': ['Mascara', 'Eyeliners', 'Eyeshadows', 'Pencil'],
    'face': ['Foundation', 'Powder', 'Blushes'],
    'nails': ['Nail Polish', 'Nail Care', 'French Manicure'],
    'accessories': ['Sharpeners']
};

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { category } = await params;
    const { type } = await searchParams;

    // Normalize category for display and matching (capitalize first letter)
    const categorySlug = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    // Build where clause - use exact match since we normalized the slug
    const whereClause: any = {
        category: {
            name: categorySlug, // Exact match after normalization
        },
    };

    // Add subcategory filter if type is specified
    if (type) {
        whereClause.subcategory = type; // Exact match for subcategory
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });

    // Get available subcategories for this category
    const subcategories = subcategoryOptions[category.toLowerCase()] || [];

    // Determine banner image path with priority: subcategory > category fallback
    const getBannerPath = () => {
        const cat = category.toLowerCase();
        const basePath = `/images/banners/${cat}`;

        // Priority 1: Subcategory banner if type filter is active
        // Format: /images/banners/nails/nails-french-manicure.jpg
        if (type) {
            // Clean type to match filenames (ex: 'Lip Pencil' -> 'lip-pencil')
            let typeSlug = type.toLowerCase().replace(/\s+/g, '-');

            // Special case: 'Eyeliners' -> 'eyeliner' (file is singular)
            if (type === 'Eyeliners') {
                typeSlug = 'eyeliner';
            }

            return `${basePath}/${cat}-${typeSlug}.jpg`;
        }

        // Priority 2: Category default banner (if exists)
        // Format: /images/banners/nails/nails.jpg
        return `${basePath}/${cat}.jpg`;
    };

    const bannerPath = getBannerPath();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="pt-24 pb-24 flex-grow">
                {/* Category Banner */}
                <CategoryBanner
                    key={bannerPath}
                    bannerPath={bannerPath}
                    title={type || categorySlug}
                />

                <div className="max-w-7xl mx-auto px-4 md:px-12">
                    {/* Breadcrumbs */}
                    <nav className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-8 flex gap-2">
                        <Link href="/" className="hover:text-charcoal transition-luxury">
                            Accueil
                        </Link>
                        <span>/</span>
                        <span className="text-charcoal font-bold">{categorySlug}</span>
                        {type && (
                            <>
                                <span>/</span>
                                <span className="text-gold font-bold">{type}</span>
                            </>
                        )}
                    </nav>

                    {/* Sub-category Navigation */}
                    <header className="mb-16">
                        {subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-8">
                                <Link
                                    href={`/shop/${category.toLowerCase()}`}
                                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${!type
                                        ? 'bg-charcoal text-white border-charcoal'
                                        : 'bg-white text-charcoal border-beige/40 hover:border-gold'
                                        }`}
                                >
                                    Tout Voir
                                </Link>
                                {subcategories.map((sub) => (
                                    <Link
                                        key={sub}
                                        href={`/shop/${category.toLowerCase()}?type=${sub}`}
                                        className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${type === sub
                                            ? 'bg-charcoal text-white border-charcoal'
                                            : 'bg-white text-charcoal border-beige/40 hover:border-gold'
                                            }`}
                                    >
                                        {sub}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                        {products.map((p) => (
                            <DBProductCard key={p.id} product={p} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-20 bg-nude/10 border border-dashed border-beige/40">
                            <p className="font-serif text-xl opacity-50">
                                {type
                                    ? `Aucun produit trouvé dans ${type}.`
                                    : `Aucun produit trouvé dans cette catégorie.`
                                }
                            </p>
                            {type && (
                                <Link
                                    href={`/shop/${category.toLowerCase()}`}
                                    className="inline-block mt-4 text-xs uppercase tracking-widest text-gold hover:text-gold-dark"
                                >
                                    Voir tous les produits {categorySlug}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
