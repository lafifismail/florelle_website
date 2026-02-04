import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/home/TrustBadges';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { DBProductCard } from '@/components/ui/DBProductCard';
import { getFeaturedProducts } from '@/lib/actions';
import Link from 'next/link';

export default async function Home() {
    // Fetch featured products from database
    const products = await getFeaturedProducts();
    const displayProducts = products.slice(0, 4); // Display first 4 featured products

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main>
                <Hero />
                <TrustBadges />

                {/* Categories Preview */}
                <section className="py-24 px-4 md:px-12 bg-off-white">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-5xl mb-4">Parcourir par Univers</h2>
                        <div className="w-12 h-[1px] bg-gold mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {['Eyes', 'Lips', 'Face', 'Nails'].map((cat) => (
                            <Link
                                key={cat}
                                href={`/shop/${cat.toLowerCase()}`}
                                className="relative aspect-square overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-nude/30 group-hover:bg-nude/50 transition-luxury" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-serif text-2xl uppercase tracking-widest">{cat}</span>
                                </div>
                                <div className="absolute inset-x-8 bottom-8 h-px bg-charcoal scale-x-0 group-hover:scale-x-100 transition-luxury origin-left" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-24 px-4 md:px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="space-y-4">
                            <h2 className="font-serif text-3xl md:text-5xl">Les Incontournables</h2>
                            <p className="text-xs uppercase tracking-widest text-charcoal/50">Sélectionnés pour vous ce mois-ci</p>
                        </div>
                        <Link href="/shop/eyes" className="text-xs uppercase tracking-widest font-bold border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-luxury">
                            Découvrir toute la collection
                        </Link>
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 max-w-7xl mx-auto">
                            {displayProducts.map((product) => (
                                <DBProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-charcoal/50 font-serif text-xl">Aucun produit disponible pour le moment</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

