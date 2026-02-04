'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export const UserSearch = () => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`/admin/users?${params.toString()}`);
    }, 300);

    return (
        <div className="relative max-w-sm w-full">
            <input
                type="text"
                placeholder="Rechercher par email..."
                className="w-full border border-gray-300 rounded-md py-3 px-4 pr-10 focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none text-base bg-white text-black placeholder:text-gray-500 appearance-none transition-all relative z-10"
                style={{ color: 'black', opacity: 1 }}
                defaultValue={searchParams.get('search')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-20 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
    );
};
