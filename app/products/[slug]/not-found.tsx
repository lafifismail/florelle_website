import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-off-white px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="font-serif text-6xl text-charcoal">404</h1>
                <h2 className="font-serif text-2xl text-charcoal">Produit introuvable</h2>
                <p className="text-charcoal/60">
                    Désolé, ce produit n'existe pas ou n'est plus disponible.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-charcoal text-white hover:bg-gold transition-luxury font-sans text-sm uppercase tracking-wider"
                    >
                        Retour à l'accueil
                    </Link>
                    <Link
                        href="/shop"
                        className="px-6 py-3 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-luxury font-sans text-sm uppercase tracking-wider"
                    >
                        Voir le catalogue
                    </Link>
                </div>
            </div>
        </div>
    );
}
