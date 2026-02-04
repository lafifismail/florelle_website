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
        <div className="w-full pt-8 pb-16 px-4">
            <div className="flex items-center justify-between w-full">
                {STEPS.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isLast = index === activeIndex;

                    return (
                        <React.Fragment key={step.key}>
                            {/* Step Circle & Label */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 z-10 bg-white
                                        ${isCompleted ? 'border-gold text-gold' : 'border-gray-200 text-gray-200'}
                                        ${isLast ? 'shadow-[0_0_0_4px_rgba(197,160,89,0.2)]' : ''}
                                    `}
                                >
                                    {index < activeIndex ? (
                                        <Check size={14} strokeWidth={3} />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-gold' : 'bg-gray-200'}`} />
                                    )}
                                </div>

                                {/* Label - Position Absolute but centered */}
                                <div
                                    className={`
                                        absolute top-14 left-1/2 -translate-x-1/2 text-center
                                        text-[9px] md:text-xs uppercase tracking-widest font-bold w-20 leading-3
                                        ${isCompleted ? 'text-charcoal' : 'text-gray-300'}
                                    `}
                                >
                                    {step.label}
                                </div>
                            </div>

                            {/* Connector Line (except after last item) */}
                            {index < STEPS.length - 1 && (
                                <div className={`h-[1px] flex-1 mx-1 ${index < activeIndex ? 'bg-gold' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
