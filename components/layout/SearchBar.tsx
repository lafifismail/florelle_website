'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial load: set query from URL if param exists
    useEffect(() => {
        setMounted(true);
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
                if (!query) setIsOpen(false);
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
        setIsPressed(true);
        setTimeout(() => {
            setIsOpen(!isOpen);
            setIsPressed(false);
            if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }, 150);
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            {/* Desktop & Mobile Toggle Button */}
            <button
                onClick={toggleSearch}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setTimeout(() => setIsPressed(false), 200)}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                className={`
                    p-2 rounded-full transition-all duration-150 z-20 relative
                    ${isPressed
                        ? 'bg-charcoal text-white scale-95'
                        : 'text-charcoal hover:text-gold'
                    }
                `}
                aria-label="Rechercher"
                suppressHydrationWarning
            >
                {isOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>

            {/* Expandable Input Container */}
            <div
                className={`
                    absolute right-0 top-1/2 -translate-y-1/2 h-10 bg-white shadow-sm flex items-center overflow-hidden transition-all duration-300 ease-in-out z-10
                    ${isOpen ? 'w-[calc(100vw-40px)] md:w-64 opacity-100 pr-10 pl-2 border border-gray-200 rounded-sm' : 'w-0 opacity-0 border-none'}
                    md:right-0 md:origin-right
                    max-md:fixed max-md:top-[64px] max-md:left-0 max-md:w-full max-md:h-16 max-md:border-b max-md:border-gray-100 max-md:justify-center max-md:px-4 max-md:bg-white max-md:translate-y-0
                `}
                suppressHydrationWarning
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
