'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
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
                // Check if user is admin
                const session = await getSession();
                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin/users');
                } else {
                    router.push(callbackUrl);
                }
                router.refresh();
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
