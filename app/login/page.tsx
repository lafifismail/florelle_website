'use client';

import React, { useState, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
                setIsLoading(false);
            } else {
                // Success - Redirect
                router.push(callbackUrl);
                router.refresh(); // Ensure session is updated
            }
        } catch (error) {
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 text-sm text-center border border-red-100 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-beige/40 focus:border-gold outline-none py-2 transition-colors bg-transparent"
                    placeholder="exemple@email.com"
                    suppressHydrationWarning
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Mot de passe</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-beige/40 focus:border-gold outline-none py-2 transition-colors bg-transparent"
                    placeholder="********"
                    suppressHydrationWarning
                />
            </div>

            <Button fullWidth disabled={isLoading} type="submit">
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>

            <div className="text-center text-xs text-charcoal/60 pt-4">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-gold font-bold hover:underline">
                    Créer un compte
                </Link>
            </div>
        </form>
    );
}

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
