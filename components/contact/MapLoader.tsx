'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse rounded-xl">
            <span className="text-gray-400 font-serif">Chargement de la carte...</span>
        </div>
    ),
});

export default function MapLoader() {
    return <Map />;
}
