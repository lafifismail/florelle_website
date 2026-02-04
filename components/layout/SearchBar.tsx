'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial load: set query from URL if param exists
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) setQuery(q);
    }, [searchParams]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (!query) setIsOpen(false); // Only close if empty, otherwise keep user context or let them close manually
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const toggleSearch = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Opening
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            {/* Desktop & Mobile Toggle Button */}
            <button
                onClick={toggleSearch}
                className="p-2 text-charcoal hover:text-gold transition-colors duration-300 z-20 relative"
                aria-label="Rechercher"
            >
                {isOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>

            {/* Expandable Input Container */}
            <div
                className={`
                    absolute right-0 top-1/2 -translate-y-1/2 h-10 bg-white shadow-sm flex items-center overflow-hidden transition-all duration-300 ease-in-out z-10
                    ${isOpen ? 'w-[calc(100vw-40px)] md:w-64 opacity-100 pr-10 pl-2 border border-gray-200 rounded-sm' : 'w-0 opacity-0 border-none'}
                    /* Mobile Override: On small screens, position differently to avoid overflow issues if needed. 
                       Currently using right-0 with viewport calc width to cover header space safely. */
                    md:right-0 md:origin-right
                    max-md:fixed max-md:top-[64px] max-md:left-0 max-md:w-full max-md:h-16 max-md:border-b max-md:border-gray-100 max-md:justify-center max-md:px-4 max-md:bg-white max-md:translate-y-0
                `}
            >
                <form onSubmit={handleSubmit} className="w-full h-full flex items-center">
                    <input
                        suppressHydrationWarning
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="w-full bg-transparent border-none outline-none text-sm text-charcoal placeholder:text-gray-400 font-light h-full px-2"
                    />
                </form>
            </div>
        </div>
    );
};
