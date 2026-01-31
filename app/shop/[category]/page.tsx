import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { SubCategoryNav } from '@/components/shop/SubCategoryNav';
import { getProductsByCategory, getShopStructure } from '@/lib/products';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const products = getProductsByCategory(category);
    const structure = getShopStructure();
    const subcategories = structure[category.toLowerCase()] || [];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="pt-24 pb-24 px-4 md:px-12 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-8 flex gap-2">
                        <Link href="/" className="hover:text-charcoal transition-luxury">
                            Accueil
                        </Link>
                        <span>/</span>
                        <span className="text-charcoal font-bold">{category}</span>
                    </nav>

                    {/* Page Title */}
                    <header className="mb-16">
                        <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-tight mb-6">
                            {category}
                        </h1>

                        {/* Sub-category Navigation */}
                        <SubCategoryNav category={category} subcategories={subcategories} />
                    </header>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-20 bg-nude/10 border border-dashed border-beige/40">
                            <p className="font-serif text-xl opacity-50">Aucun produit trouvé dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
