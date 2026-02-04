'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const CATEGORIES = [
    { label: 'Toutes les catégories', value: 'all' },
    { label: 'Lips', value: 'Lips' },
    { label: 'Eyes', value: 'Eyes' },
    { label: 'Face', value: 'Face' },
    { label: 'Nails', value: 'Nails' },
    { label: 'Accessories', value: 'Accessories' },
];

export function CategoryFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = (category: string) => {
        const params = new URLSearchParams(searchParams);

        // Reset to page 1 when filtering
        params.set('page', '1');

        if (category && category !== 'all') {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative">
            <select
                className="block w-full rounded-sm border border-beige/40 py-[9px] pl-3 pr-10 text-sm outline-none focus:border-gold focus:ring-0 bg-white text-charcoal/80 appearance-none cursor-pointer transition-all hover:border-gold/50 h-[42px]"
                onChange={(e) => handleFilter(e.target.value)}
                defaultValue={searchParams.get('category')?.toString() || 'all'}
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                ))}
            </select>
            {/* Custom arrow for styling consistency if needed, but standard select arrow is fine for admin */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}
