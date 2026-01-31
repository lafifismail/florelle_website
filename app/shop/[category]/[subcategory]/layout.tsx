import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ReactNode } from 'react';

export default function SubCategoryLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            {/* No padding or container - let children control their layout */}
            <main className="pt-16 flex-grow">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
