import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import PromoBanner from '@/components/home/PromoBanner';
import { TrustBadges } from '@/components/home/TrustBadges';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { DBProductCard } from '@/components/ui/DBProductCard';
import { getFeaturedProducts } from '@/lib/actions';
import { getSiteSettings } from '@/lib/actions/settings';
import { SocialWall } from '@/components/home/SocialWall';
import Link from 'next/link';

export default async function Home() {
    // Fetch featured products from database
    const products = await getFeaturedProducts();
    const displayProducts = products.slice(0, 4); // Display first 4 featured products

    // Fetch site settings for banners
    const settings = await getSiteSettings() as any; // Cast to any for new fields

    const eyesImage = settings?.eyesBannerUrl || '/images/banners/eyes/eyes-small-banner.png';
    const lipsImage = settings?.lipsBannerUrl || '/images/banners/lips/lips-small-banner.png';
    const faceImage = settings?.faceBannerUrl || '/images/banners/face/face-small-banner.png';
    const nailsImage = settings?.nailsBannerUrl || '/images/banners/nails/nails-small-banner.png';

    const universeCategories = [
        { name: 'Eyes', image: eyesImage },
        { name: 'Lips', image: lipsImage },
        { name: 'Face', image: faceImage },
        { name: 'Nails', image: nailsImage }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main>
                <Hero />
                <PromoBanner />
                <TrustBadges />


                {/* Categories Preview */}
                <section className="py-24 px-4 md:px-12 bg-off-white">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-5xl mb-4">Parcourir par Univers</h2>
                        <div className="w-12 h-[1px] bg-gold mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {universeCategories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/shop/${cat.name.toLowerCase()}`}
                                className="relative aspect-square overflow-hidden group block"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                />

                                {/* Dark Overlay for text readability */}
                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/50" />

                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="font-serif text-2xl uppercase tracking-widest text-white drop-shadow-md">{cat.name}</span>
                                </div>

                                <div className="absolute inset-x-8 bottom-8 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-luxury origin-left z-10" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-24 px-4 md:px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-4 md:gap-8 text-center md:text-left">
                        <div className="space-y-2 md:space-y-4">
                            <h2 className="font-serif text-3xl md:text-5xl">Les Incontournables</h2>
                            <p className="text-xs uppercase tracking-widest text-charcoal/50">Sélectionnés pour vous ce mois-ci</p>
                        </div>
                        <Link href="/shop/eyes" className="text-xs uppercase tracking-widest font-bold border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-luxury">
                            Découvrir toute la collection
                        </Link>
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className="flex overflow-x-auto snap-x gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-12 max-w-7xl mx-auto scrollbar-hide -mx-4 px-4 md:mx-auto md:px-0">
                            {displayProducts.map((product) => (
                                <div key={product.id} className="min-w-[170px] w-[45vw] md:w-auto md:min-w-0 snap-start">
                                    <DBProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-charcoal/50 font-serif text-xl">Aucun produit disponible pour le moment</p>
                        </div>
                    )
                    }
                </section>

                <SocialWall />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

