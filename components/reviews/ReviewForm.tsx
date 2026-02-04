'use client';

import { useState } from 'react';
import StarRating from '../ui/StarRating';
import { addReview } from '@/lib/actions/reviews';
import { Loader2 } from 'lucide-react';

export default function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Veuillez sélectionner une note.');
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview(productId, rating, comment);
            setSubmitted(true);
            setRating(0);
            setComment('');
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 p-6 text-center rounded-sm animate-in fade-in">
                <p className="text-green-800 font-serif text-lg mb-2">Merci pour votre avis !</p>
                <p className="text-green-600 text-sm">Il sera publié dès qu'il aura été approuvé par notre équipe.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs underline text-green-700">Laisser un autre avis</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-beige/20 shadow-sm rounded-sm max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-6 text-charcoal text-center">Votre avis compte</h3>

            <div className="mb-6 flex flex-col items-center">
                <label className="text-xs uppercase tracking-widest text-charcoal/60 mb-3">Note globale</label>
                <StarRating
                    rating={rating}
                    size={32}
                    interactive={true}
                    onRatingChange={setRating}
                />
            </div>

            <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 block">Votre commentaire (optionnel)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Qu'avez-vous pensé de ce produit ?"
                    className="w-full bg-off-white border border-beige/20 p-4 focus:border-gold outline-none rounded-sm resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-charcoal text-white py-3 uppercase tracking-widest text-sm hover:bg-gold transition-luxury disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Envoyer mon avis'}
            </button>
        </form>
    );
}
