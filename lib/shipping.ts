
export const SHIPPING_ZONES = {
    ZONE_1: ["Casablanca", "Mohammédia"],
    // Zone 2 is everything else
};

export const SHIPPING_RATES = {
    ZONE_1: {
        cost: 25,
        freeThreshold: 400
    },
    ZONE_2: {
        cost: 45,
        freeThreshold: 600
    }
};

export function calculateShippingFee(city: string, subTotal: number): number {
    if (!city) return 0; // Or default? For now 0 until city selected.

    const normalizedCity = city.trim().toLowerCase();
    const isZone1 = SHIPPING_ZONES.ZONE_1.some(z => z.trim().toLowerCase() === normalizedCity);

    const rate = isZone1 ? SHIPPING_RATES.ZONE_1 : SHIPPING_RATES.ZONE_2;

    if (subTotal >= rate.freeThreshold) {
        return 0;
    }

    return rate.cost;
}
