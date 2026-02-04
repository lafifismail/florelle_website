'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput({ placeholder, defaultValue }: { placeholder: string, defaultValue?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        // Reset to page 1 when searching
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex-1 w-full">
            <label htmlFor="search" className="sr-only">
                Rechercher
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-10 text-base outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 placeholder:text-gray-500 bg-white text-black appearance-none transition-all relative z-10"
                placeholder={placeholder}
                style={{ color: 'black', opacity: 1 }}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={defaultValue}
            />
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gold transition-colors z-20 pointer-events-none" />
        </div>
    );
}
