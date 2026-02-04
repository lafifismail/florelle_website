'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    max?: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    color?: string;
}

export default function StarRating({
    rating,
    max = 5,
    size = 16,
    interactive = false,
    onRatingChange,
    color = "#D4AF37" // Gold
}: StarRatingProps) {

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => {
                const filled = i < Math.round(rating); // Simple rounding for display
                return (
                    <Star
                        key={i}
                        size={size}
                        fill={filled ? color : "transparent"}
                        stroke={filled ? color : "#9ca3af"} // Gray stroke for empty
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && onRatingChange?.(i + 1)}
                    />
                );
            })}
        </div>
    );
}
