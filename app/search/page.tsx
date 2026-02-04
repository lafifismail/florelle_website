import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DBProductCard, DBProduct } from '@/components/ui/DBProductCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const metadata = {
    title: 'Résultats de recherche | Florelle',
    description: 'Résultats de votre recherche sur la boutique Florelle.',
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

// Synonym dictionary (French -> English)
// Normalize keys to lowercase for matching
const SYNONYMS: Record<string, string> = {
    'visage': 'face',
    'yeux': 'eyes',
    'oeil': 'eyes',
    'lèvres': 'lips',
    'levres': 'lips',
    'bouche': 'lips',
    'rouge': 'lips', // "Rouge" often implies "Rouge à lèvres"
    'ongles': 'nails',
    'vernis': 'nails',
    'accessoires': 'accessories',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';

    // Explicitly type products as DBProduct[] or compatible structure
    // We fetch logic that matches DBProduct requirements
    let products: any[] = [];

    if (query.trim().length > 0) {
        const lowerQuery = query.toLowerCase().trim();
        const searchTerms = [query]; // Always search the original term

        // Check for synonym match
        if (SYNONYMS[lowerQuery]) {
            searchTerms.push(SYNONYMS[lowerQuery]);
        }

        // Build dynamic OR conditions
        const orConditions: any[] = [];

        searchTerms.forEach(term => {
            orConditions.push(
                { name: { contains: term } },
                { description: { contains: term } },
                { category: { name: { contains: term } } }
            );
        });

        products = await prisma.product.findMany({
            where: {
                OR: orConditions
            },
            include: {
                category: true,
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            take: 50
        });
    }

    // Cast the specific results to DBProduct for the component
    // Prisma result is strictly compatible with DBProduct interface now that we included category and reviews.
    const displayProducts = products as unknown as DBProduct[];

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="mb-12 text-center md:text-left">
                        {query ? (
                            <>
                                <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
                                    Résultats pour : <span className="text-[#E30039] italic">"{query}"</span>
                                </h1>
                                <p className="text-charcoal/60 uppercase tracking-widest text-xs">
                                    {displayProducts.length} {displayProducts.length === 1 ? 'Produit trouvé' : 'Produits trouvés'}
                                </p>
                            </>
                        ) : (
                            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
                                Rechercher un produit
                            </h1>
                        )}
                    </div>

                    {/* Results Grid */}
                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {displayProducts.map((product) => (
                                <DBProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 bg-white border border-dashed border-gray-200 rounded-sm">
                            <div className="bg-gray-50 p-4 rounded-full">
                                <Search size={32} className="text-gray-300" />
                            </div>
                            <div className="max-w-md space-y-2">
                                <h2 className="font-serif text-2xl text-charcoal">
                                    Oups, nous n'avons rien trouvé.
                                </h2>
                                <p className="text-charcoal/60 font-light">
                                    Nous n'avons trouvé aucun résultat pour "{query}". Essayez un autre mot-clé ou parcourez nos catégories.
                                </p>
                            </div>
                            <Link href="/">
                                <Button className="bg-charcoal text-white hover:bg-[#E30039]">
                                    Voir tous nos produits
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
