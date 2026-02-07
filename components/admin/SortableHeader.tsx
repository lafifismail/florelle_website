'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface SortableHeaderProps {
    column: string;
    label: string;
    className?: string;
}

export function SortableHeader({ column, label, className = '' }: SortableHeaderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order') || 'asc';
    const isActive = currentSort === column;

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);

        if (isActive) {
            // Toggle order if already sorting by this column
            params.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort column with default order
            params.set('sort', column);
            // Default order based on column type
            if (column === 'stock') {
                params.set('order', 'asc'); // Low stock first
            } else if (column === 'price') {
                params.set('order', 'desc'); // High price first
            } else {
                params.set('order', 'asc'); // A-Z for name
            }
        }

        // Reset to page 1 when sorting changes
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <th
            className={`p-4 font-normal cursor-pointer select-none hover:bg-beige/10 transition-colors ${className}`}
            onClick={handleClick}
        >
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUp
                        size={12}
                        className={`-mb-1 ${isActive && currentOrder === 'asc' ? 'text-gold' : 'text-charcoal/30'}`}
                    />
                    <ChevronDown
                        size={12}
                        className={`-mt-1 ${isActive && currentOrder === 'desc' ? 'text-gold' : 'text-charcoal/30'}`}
                    />
                </div>
            </div>
        </th>
    );
}
