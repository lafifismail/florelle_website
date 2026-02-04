'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { updateProfile } from '@/lib/actions';

// Helper to mask CIN
const maskCIN = (cin: string | null) => {
    if (!cin) return '--';
    if (cin.length <= 4) return cin;
    return `${cin.substring(0, 2)}****${cin.substring(cin.length - 2)}`;
};

interface User {
    name: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    cin: string | null;
}

export const ProfileCard = ({ user }: { user: User }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        cin: user.cin || ''
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
            // In a real app, use toast
            // alert("Profil mis à jour avec succès !"); 
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white p-6 shadow-sm border border-gold/30 rounded-sm animate-in fade-in duration-300 ring-1 ring-gold/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl text-charcoal">Modifier mes informations</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-gold-dark">Nom Complet</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-b border-beige/40 py-1 text-sm focus:border-gold outline-none bg-transparent transition-colors"
                            placeholder="Votre nom"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-gold-dark">Email (Fixe)</label>
                        <p className="py-1 text-sm text-charcoal/50 cursor-not-allowed">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-gold-dark">Téléphone</label>
                        <input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border-b border-beige/40 py-1 text-sm focus:border-gold outline-none bg-transparent transition-colors"
                            placeholder="06XXXXXXXX"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-gold-dark">Ville</label>
                            <input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full border-b border-beige/40 py-1 text-sm focus:border-gold outline-none bg-transparent transition-colors"
                                placeholder="Ville"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-gold-dark">CIN</label>
                            <input
                                value={formData.cin}
                                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                                className="w-full border-b border-beige/40 py-1 text-sm focus:border-gold outline-none bg-transparent transition-colors font-mono"
                                placeholder="CIN"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-beige/10 flex gap-3">
                    <Button variant="outline" fullWidth onClick={() => setIsEditing(false)} disabled={loading}>
                        Annuler
                    </Button>
                    <Button variant="primary" fullWidth onClick={handleSave} disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                </div>
            </div>
        );
    }

    // View Mode
    return (
        <div className="bg-white p-6 shadow-sm border border-beige/20 rounded-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-charcoal">Mon Profil</h2>
                <span className="text-xs bg-gold/10 text-gold-dark px-2 py-1 rounded-full font-medium">Vérifié</span>
            </div>

            <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Nom Complet</p>
                    <p className="font-medium text-sm text-charcoal">{user.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Email</p>
                    <p className="font-medium text-sm text-charcoal">{user.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Téléphone</p>
                    <p className="font-medium text-sm text-charcoal">{user.phone || '--'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Ville</p>
                        <p className="font-medium text-sm text-charcoal">{user.city || '--'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">CIN</p>
                        <p className="font-medium text-sm font-mono text-charcoal/80">
                            {maskCIN(user.cin)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-beige/10">
                <Button variant="outline" fullWidth onClick={() => setIsEditing(true)}>
                    Modifier mes informations
                </Button>
                <div className="mt-4"></div>
                <LogoutButton />
            </div>
        </div>
    );
};
