'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubCategoryNavProps {
    category: string;
    subcategories: string[];
}

// Helper function to format subcategory names for display
const formatSubcategoryName = (subcategory: string): string => {
    return subcategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export function SubCategoryNav({ category, subcategories }: SubCategoryNavProps) {
    const pathname = usePathname();
    const currentSubcategory = pathname.split('/').pop();

    // Check if we're on the main category page (no subcategory selected)
    const isMainCategoryPage = pathname === `/shop/${category}`;

    if (subcategories.length === 0) {
        return null;
    }

    return (
        <div className="mb-12 border-t border-b border-nude/30 py-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-6">
                Filtrer par type
            </p>
            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/shop/${category}`}
                    className={`
                        px-6 py-3 border text-xs uppercase tracking-wider transition-luxury whitespace-nowrap rounded-sm
                        ${isMainCategoryPage
                            ? 'border-gold bg-gold text-white shadow-md'
                            : 'border-charcoal/20 hover:border-gold hover:text-gold bg-white'
                        }
                    `}
                >
                    ✨ Tout voir
                </Link>
                {subcategories.map((sub) => {
                    const isActive = currentSubcategory === sub.toLowerCase();
                    return (
                        <Link
                            key={sub}
                            href={`/shop/${category}/${sub.toLowerCase()}`}
                            className={`
                                px-6 py-3 border text-xs uppercase tracking-wider transition-luxury whitespace-nowrap rounded-sm
                                ${isActive
                                    ? 'border-charcoal bg-charcoal text-white shadow-md'
                                    : 'border-charcoal/20 hover:border-charcoal hover:text-charcoal bg-white'
                                }
                            `}
                        >
                            {formatSubcategoryName(sub)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
