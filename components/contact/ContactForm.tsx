'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            setStatus('error');
            setMessage("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="group">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom & Prénom *"
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="group">
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Objet"
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                        disabled={isLoading}
                    />
                </div>
                <div className="group">
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre message..."
                        rows={5}
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-charcoal placeholder-gray-400 focus:border-black focus:outline-none transition-colors resize-none"
                        required
                        disabled={isLoading}
                    ></textarea>
                </div>
            </div>

            {message && (
                <div className={`p-4 text-sm ${status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#E30039] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Envoi en cours...
                    </>
                ) : (
                    'Envoyer le message'
                )}
            </button>
        </form>
    );
}
