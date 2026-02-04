'use client';

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    // On initialise le state avec la valeur de l'URL pour être synchro au chargement
    const [term, setTerm] = useState(searchParams.get('query')?.toString() || '');

    // Cette fonction gère la mise à jour de l'URL avec un délai (pour ne pas spammer)
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        params.set('page', '1'); // On revient toujours à la page 1 quand on cherche

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query'); // C'est ici que la suppression se fait
        }

        replace(`${window.location.pathname}?${params.toString()}`);
    }, 300);

    // Effet pour garder l'input synchro si l'URL change autrement (ex: navigation arrière)
    useEffect(() => {
        setTerm(searchParams.get('query')?.toString() || '');
    }, [searchParams]);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Recherche
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 bg-white py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900 focus:border-gold focus:ring-gold"
                placeholder={placeholder}
                onChange={(e) => {
                    setTerm(e.target.value); // Met à jour l'affichage immédiatement
                    handleSearch(e.target.value); // Lance la recherche (URL) après 300ms
                }}
                value={term} // L'input est maintenant "contrôlé", impossible d'avoir des bugs d'affichage
            />
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}
