import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutHistory } from '@/components/about/AboutHistory';
import { AboutPromise } from '@/components/about/AboutPromise';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
    title: 'Notre Histoire | Florelle',
    description: 'Découvrez l\'histoire de la marque Florelle, née à Milan en 1993.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-off-white flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <AboutHero />
                <AboutHistory />
                <AboutPromise />

                {/* Call to Action */}
                <section className="py-24 text-center bg-white border-t border-beige/20">
                    <div className="max-w-2xl mx-auto px-4 space-y-8">
                        <p className="font-serif text-2xl text-charcoal">
                            Prête à découvrir l'excellence ?
                        </p>
                        <div className="flex justify-center">
                            <Link href="/shop/eyes">
                                <Button className="bg-charcoal text-white hover:bg-gold px-8 py-6 rounded-sm text-xs md:text-sm tracking-widest uppercase transition-all duration-300">
                                    DÉCOUVRIR LA COLLECTION
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
