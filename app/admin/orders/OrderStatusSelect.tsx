'use client';

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

const STATUSES = [
    { value: 'PENDING', label: 'En attente' },
    { value: 'PROCESSING', label: 'En préparation' },
    { value: 'SHIPPED', label: 'Expédiée' },
    { value: 'DELIVERED', label: 'Livrée' },
    { value: 'CANCELLED', label: 'Annulée' }
];

export const OrderStatusSelect = ({ orderId, currentStatus }: OrderStatusSelectProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!newStatus || newStatus === currentStatus) return;

        setIsLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            router.refresh();
        } catch (error) {
            alert("Erreur lors de la mise à jour");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isLoading}
                className={`
                    appearance-none pl-3 pr-8 py-1 rounded text-xs font-medium border cursor-pointer outline-none focus:ring-1 focus:ring-gold
                    ${currentStatus === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                        currentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-white text-gray-700 border-gray-200 hover:border-gold'}
                `}
            >
                {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>
            {isLoading && <span className="absolute right-8 top-1.5 text-[10px] text-gold">...</span>}
        </div>
    );
};
