import { getAdminReviews, toggleReviewStatus, deleteReview } from "@/lib/actions/reviews";
import { Check, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminReviewsPage() {
    const reviews = await getAdminReviews();

    return (
        <div className="space-y-8 animate-in fade-in">
            <header className="flex items-center justify-between border-b border-beige/20 pb-6">
                <div>
                    <h1 className="font-serif text-3xl text-charcoal">Modération des Avis</h1>
                    <p className="text-xs uppercase tracking-widest text-gold mt-2 font-bold">Gérez la réputation de votre marque</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">{reviews.length} Avis Total</p>
                    <p className="text-xs text-orange-500">{reviews.filter(r => !r.isApproved).length} en attente</p>
                </div>
            </header>

            <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-off-white border-b border-beige/20 text-charcoal/60 uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Client</th>
                            <th className="p-4 font-normal">Produit</th>
                            <th className="p-4 font-normal">Note</th>
                            <th className="p-4 font-normal">Commentaire</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/10">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-charcoal/40 italic">Aucun avis à modérer.</td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id} className={`hover:bg-off-white/50 transition-colors ${!review.isApproved ? 'bg-orange-50/30' : ''}`}>
                                    <td className="p-4 whitespace-nowrap text-charcoal/60">
                                        {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: fr })}
                                    </td>
                                    <td className="p-4 font-bold text-charcoal">
                                        {review.user.name || review.user.email}
                                    </td>
                                    <td className="p-4 text-charcoal/80">
                                        {review.product.name}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex text-gold">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-xs truncate text-charcoal/70" title={review.comment}>
                                        {review.comment}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={async () => {
                                                'use server';
                                                await toggleReviewStatus(review.id);
                                            }}>
                                                <button
                                                    className={`p-1.5 rounded-full transition-colors ${review.isApproved ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-600'}`}
                                                    title={review.isApproved ? "Désapprouver" : "Approuver"}
                                                >
                                                    {review.isApproved ? <Check size={14} /> : <Check size={14} />}
                                                </button>
                                            </form>

                                            <form action={async () => {
                                                'use server';
                                                await deleteReview(review.id);
                                            }}>
                                                <button
                                                    className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                    title="Supprimer"
                                                    type="submit"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
