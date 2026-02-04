import React from 'react';
import { Check } from 'lucide-react';

interface OrderStepperProps {
    status: string;
}

const STEPS = [
    { key: 'PENDING', label: 'Commande Validée' },
    { key: 'PROCESSING', label: 'En Préparation' },
    { key: 'SHIPPED', label: 'En Route' },
    { key: 'DELIVERED', label: 'Livrée' }
];

export const OrderStepper = ({ status }: OrderStepperProps) => {
    // Map status to index
    let activeIndex = 0;

    switch (status) {
        case 'PENDING': activeIndex = 0; break;
        case 'PROCESSING': activeIndex = 1; break;
        case 'SHIPPED': activeIndex = 2; break;
        case 'DELIVERED': activeIndex = 3; break;
        case 'CANCELLED': return <div className="text-red-500 font-serif text-center py-4">Cette commande a été annulée.</div>;
        default: activeIndex = 0;
    }

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between relative px-4">
                {/* Background Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-100 z-0 mx-8" />

                {/* Active Line Progress */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gold z-0 mx-8 transition-all duration-1000 ease-in-out"
                    style={{ width: `${(activeIndex / (STEPS.length - 1)) * 90}%` }} // Approximate width
                />

                {STEPS.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isLast = index === activeIndex;

                    return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500
                                    ${isCompleted ? 'bg-white border-gold text-gold' : 'bg-white border-gray-200 text-gray-200'}
                                    ${isLast ? 'shadow-[0_0_0_4px_rgba(197,160,89,0.2)]' : ''}
                                `}
                            >
                                {index < activeIndex ? (
                                    <Check size={14} strokeWidth={3} />
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-gold' : 'bg-gray-200'}`} />
                                )}
                            </div>
                            <div
                                className={`
                                    absolute top-10 w-24 left-1/2 -translate-x-1/2 text-center leading-tight
                                    text-[10px] md:text-xs uppercase tracking-widest font-bold
                                    ${isCompleted ? 'text-charcoal' : 'text-gray-300'}
                                `}
                            >
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
