'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const ROLES = [
    { label: 'Tous les utilisateurs', value: 'all' },
    { label: 'Administrateurs', value: 'ADMIN' },
    { label: 'Clients', value: 'USER' },
];

export function RoleFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);

        if (role && role !== 'all') {
            params.set('role', role);
        } else {
            params.delete('role');
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative">
            <select
                className="block w-full rounded-sm border border-beige/40 py-2 pl-3 pr-10 text-sm outline-none focus:border-gold focus:ring-0 bg-white text-charcoal/80 appearance-none cursor-pointer transition-all hover:border-gold/50 h-[38px]"
                onChange={(e) => handleFilter(e.target.value)}
                defaultValue={searchParams.get('role')?.toString() || 'all'}
            >
                {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                        {role.label}
                    </option>
                ))}
            </select>
            {/* Custom arrow matching UserSearch style implicit height */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}
