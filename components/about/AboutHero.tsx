'use client';

import { motion } from 'framer-motion';

export const AboutHero = () => {
    return (
        <section className="relative h-[70vh] md:h-screen w-full overflow-hidden">
            {/* Background Image with Slow Zoom Out */}
            <motion.div
                className="absolute inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat"
                style={{ backgroundImage: "url('/about/hero-banner.jpg')" }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 10, ease: "easeOut" }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            {/* Content with Staggered Fade In */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    Passion for Make Up since 1993.
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                >
                    L'élégance italienne, de Milan au Maroc.
                </motion.p>
            </div>
        </section>
    );
};
