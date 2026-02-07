'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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

    // Calculate the range of pages to display (max 5)
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pageNumbers: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const buttonClass = "h-8 w-8 p-0 flex items-center justify-center rounded-sm transition-colors text-sm";
    const activeClass = "bg-gold text-white hover:bg-gold-dark shadow-luxury";
    const inactiveClass = "border border-charcoal/20 text-charcoal hover:bg-off-white";
    const disabledClass = "border border-charcoal/20 text-charcoal/40 cursor-not-allowed";

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            {/* Previous Arrow */}
            {currentPage > 1 ? (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className={`${buttonClass} ${inactiveClass}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            ) : (
                <div className={`${buttonClass} ${disabledClass}`}>
                    <ArrowLeft className="h-4 w-4" />
                </div>
            )}

            {/* Page Number Squares */}
            {pageNumbers.map((pageNum) => (
                <Link
                    key={pageNum}
                    href={createPageURL(pageNum)}
                    className={`${buttonClass} ${pageNum === currentPage ? activeClass : inactiveClass}`}
                >
                    {pageNum}
                </Link>
            ))}

            {/* Next Arrow */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className={`${buttonClass} ${inactiveClass}`}
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
