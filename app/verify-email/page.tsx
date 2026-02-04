'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { verifyUser } from '@/lib/actions/auth';

function VerifyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');

    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);

        const result = await verifyUser(email, code);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            // Success
            router.push('/login?verified=true');
        }
    }

    if (!email) {
        return <div className="text-center text-red-500">Email manquant. Veuillez reprendre l'inscription.</div>;
    }

    return (
        <div className="max-w-md w-full mx-auto bg-white p-8 shadow-lg rounded-xl border border-beige/20 text-center space-y-6">
            <h1 className="font-serif text-2xl mb-2 text-charcoal">Vérifiez votre email</h1>
            <p className="text-charcoal/60 text-sm">
                Un code à 6 chiffres a été envoyé à <strong>{email}</strong>.
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full text-center text-3xl tracking-[0.5em] font-mono py-3 border-b-2 border-beige focus:border-gold outline-none bg-transparent transition-colors"
                        placeholder="000000"
                        maxLength={6}
                        required
                    />
                    <label className="text-[10px] uppercase tracking-widest opacity-40">Code de vérification</label>
                </div>

                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Vérification...' : 'Valider'}
                </Button>
            </form>
        </div>
    );
}

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
