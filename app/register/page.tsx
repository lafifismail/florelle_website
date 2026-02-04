'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/lib/actions/auth';
import { registerSchema } from '@/lib/validator';

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        // Convert FormData to object for Zod validation
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            cin: formData.get('cin'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
        };

        // Validate Client-Side
        const validation = registerSchema.safeParse(rawData);

        if (!validation.success) {
            const errors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errors[issue.path[0].toString()] = issue.message;
                }
            });
            setFieldErrors(errors);
            setIsLoading(false);
            return;
        }

        // Submit to Server
        const result = await registerUser(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    const ErrorMsg = ({ field }: { field: string }) => (
        fieldErrors[field] ? <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">⚠️ {fieldErrors[field]}</p> : null
    );

    const inputClass = (field: string) => `w-full border-b ${fieldErrors[field] ? 'border-red-500' : 'border-beige/40'} focus:border-gold outline-none py-2 transition-colors bg-transparent`;

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 pb-24 px-4">
                <div className="max-w-xl w-full bg-white p-8 md:p-12 shadow-luxury rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="text-center mb-8">
                        <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Créer un compte</h1>
                        <p className="text-charcoal/60 text-sm">Rejoignez l'univers Florelle Beauty</p>
                    </header>

                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 text-sm text-center border border-red-100 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Personal Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Nom Complet</label>
                                    <input name="name" type="text" className={inputClass('name')} placeholder="Prénom Nom" />
                                    <ErrorMsg field="name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Téléphone</label>
                                    <input name="phone" type="tel" className={inputClass('phone')} placeholder="06XXXXXXXX" />
                                    <ErrorMsg field="phone" />
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Email</label>
                                <input name="email" type="email" className={inputClass('email')} placeholder="exemple@email.com" />
                                <ErrorMsg field="email" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Mot de passe</label>
                                <input name="password" type="password" className={inputClass('password')} placeholder="********" />
                                <ErrorMsg field="password" />
                                <p className="text-[10px] text-charcoal/40 mt-1">Min. 8 car., Maj, Min, Chiffre, Spécial.</p>
                            </div>

                            {/* Sensitive Data */}
                            <div className="space-y-1 pt-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">CIN (Carte d'Identité)</label>
                                <input name="cin" type="text" className={inputClass('cin')} placeholder="AB123456" />
                                <ErrorMsg field="cin" />
                                <p className="text-[10px] text-charcoal/40 mt-1 italic leading-tight">
                                    Vos données (CIN, Adresse) sont chiffrées et strictement utilisées pour la vérification de vos commandes. Elles ne seront jamais partagées.
                                </p>
                            </div>

                            {/* Address */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Ville</label>
                                    <input name="city" type="text" className={inputClass('city')} placeholder="Casablanca" />
                                    <ErrorMsg field="city" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Adresse</label>
                                    <input name="address" type="text" className={inputClass('address')} placeholder="Quartier, Rue..." />
                                    <ErrorMsg field="address" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" fullWidth disabled={isLoading}>
                                {isLoading ? 'Validation en cours...' : 'S\'inscrire'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
