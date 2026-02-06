'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, X, Loader2, Check } from 'lucide-react';

interface ChangePasswordFormProps {
    onClose: () => void;
}

export default function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error when typing
        if (status === 'error') {
            setStatus('idle');
            setMessage('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        // Client-side validation
        if (formData.newPassword !== formData.confirmPassword) {
            setStatus('error');
            setMessage('Les nouveaux mots de passe ne correspondent pas.');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus('error');
            setMessage('Le nouveau mot de passe doit contenir au moins 6 caractères.');
            setIsLoading(false);
            return;
        }

        const strictPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!strictPasswordRegex.test(formData.newPassword)) {
            setStatus('error');
            setMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // Close after 2 seconds on success
                setTimeout(() => onClose(), 2000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            setStatus('error');
            setMessage("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Lock size={18} className="text-gold" />
                        <h2 className="font-serif text-lg text-charcoal">Changer le mot de passe</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Current Password */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                            Mot de passe actuel
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-md py-2.5 px-3 pr-10 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                placeholder="Entrez votre mot de passe actuel"
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-md py-2.5 px-3 pr-10 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                placeholder="8+ caractères, 1 Maj, 1 Spécial"
                                required
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 italic">
                            Min. 8 caractères, incluant une majuscule et un caractère spécial.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                            Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-md py-2.5 px-3 pr-10 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                placeholder="Confirmez le nouveau mot de passe"
                                required
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${status === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {status === 'success' ? <Check size={16} /> : <X size={16} />}
                            {message}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-4 bg-charcoal text-white text-sm font-medium rounded-md hover:bg-charcoal/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Modification...
                                </>
                            ) : (
                                'Confirmer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
