import StarRating from '../ui/StarRating';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: { name: string | null };
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 text-charcoal/40 italic">
                Aucun avis pour le moment. Soyez le premier à donner votre opinion !
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-beige/10 pb-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-serif font-bold text-lg">
                                {review.user.name ? review.user.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                                <p className="font-bold text-charcoal text-sm">{review.user.name || 'Client Florelle'}</p>
                                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                    </div>
                    {review.comment && (
                        <p className="text-charcoal/80 leading-relaxed font-light">
                            "{review.comment}"
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
