import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 py-24">
                <div className="max-w-md w-full bg-white p-8 shadow-luxury rounded-sm animate-in fade-in zoom-in-95 duration-500">
                    <header className="text-center mb-8">
                        <h1 className="font-serif text-3xl mb-2 text-charcoal">Connexion</h1>
                        <p className="text-charcoal/60 text-sm">Accédez à votre espace Florelle</p>
                    </header>

                    <Suspense fallback={<div className="text-center py-4">Chargement...</div>}>
                        <LoginForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
