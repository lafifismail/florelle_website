'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    // Use Button styles but render Link manually if active
    const buttonClass = "h-8 w-8 p-0 flex items-center justify-center rounded-sm transition-colors text-sm";
    const activeClass = "bg-gold text-white hover:bg-gold-dark shadow-luxury";
    const disabledClass = "border border-charcoal/20 text-charcoal/40 cursor-not-allowed";

    return (
        <div className="flex items-center justify-end gap-2 mt-4">
            {currentPage > 1 ? (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className={`${buttonClass} ${activeClass}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            ) : (
                <div className={`${buttonClass} ${disabledClass}`}>
                    <ArrowLeft className="h-4 w-4" />
                </div>
            )}

            <div className="text-xs text-charcoal/60 uppercase tracking-widest font-medium px-2">
                Page {currentPage} sur {totalPages}
            </div>

            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className={`${buttonClass} ${activeClass}`}
                >
                    <ArrowRight className="h-4 w-4" />
                </Link>
            ) : (
                <div className={`${buttonClass} ${disabledClass}`}>
                    <ArrowRight className="h-4 w-4" />
                </div>
            )}
        </div>
    );
}
