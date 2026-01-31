import React from 'react';
import { Crown, Timer, Leaf } from 'lucide-react';

const badges = [
    {
        icon: Crown,
        title: 'Héritage Italien',
        description: 'Inspiré par l\'excellence',
    },
    {
        icon: Timer,
        title: 'Longue Tenue',
        description: 'Performance toute la journée',
    },
    {
        icon: Leaf,
        title: 'Cruelty Free',
        description: 'Non testé sur les animaux',
    },
];

export const TrustBadges = () => {
    return (
        <section className="py-12 px-4 md:px-12 bg-nude/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {badges.map((badge, index) => {
                        const IconComponent = badge.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-3 group"
                            >
                                <div className="transform transition-luxury group-hover:scale-110">
                                    <IconComponent
                                        className="w-8 h-8 text-gold"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-charcoal">
                                        {badge.title}
                                    </h3>
                                    <p className="text-xs text-charcoal/60 tracking-wider">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

