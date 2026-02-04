import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 pb-24 px-4">
                <div className="max-w-xl w-full bg-white p-8 md:p-12 shadow-luxury rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="text-center mb-8">
                        <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Créer un compte</h1>
                        <p className="text-charcoal/60 text-sm">Rejoignez l'univers Florelle Beauty</p>
                    </header>

                    <RegisterForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}
