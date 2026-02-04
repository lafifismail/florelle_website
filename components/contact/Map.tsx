'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icons for Next.js/Leaflet
const iconFix = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

export default function Map() {
    useEffect(() => {
        iconFix();
    }, []);

    const milanCoords: [number, number] = [45.4642, 9.1900];
    const casablancaCoords: [number, number] = [33.5731, -7.5898];
    const center: [number, number] = [42, 10]; // Centered to show both

    return (
        <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={milanCoords}>
                <Popup>
                    <div className="text-center">
                        <strong>Florelle Headquarters</strong><br />
                        Via Kennedy 4, Milano
                    </div>
                </Popup>
            </Marker>

            <Marker position={casablancaCoords}>
                <Popup>
                    <div className="text-center">
                        <strong>Florelle Maroc</strong><br />
                        Boulevard d'Anfa, Casablanca
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
