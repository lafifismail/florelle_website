import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FAQClient } from './FAQClient';

export const metadata = {
    title: 'FAQ | Florelle',
    description: 'Questions fréquentes sur nos produits, la livraison et les retours.',
};

export default function FAQPage() {
    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <FAQClient />
            </main>

            <Footer />
        </div>
    );
}
