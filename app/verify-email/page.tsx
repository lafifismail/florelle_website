import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerifyForm } from '@/components/auth/VerifyForm';

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div>Chargement...</div>}>
                    <VerifyForm />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
