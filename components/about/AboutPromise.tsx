'use client';

import { motion } from 'framer-motion';

export const AboutPromise = () => {
    return (
        <section className="py-24 bg-off-white overflow-hidden">
            <div className="max-w-4xl mx-auto text-center px-4 mb-16 space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="font-serif text-4xl md:text-5xl text-charcoal"
                >
                    Notre Promesse.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xs uppercase tracking-[0.2em] text-charcoal/60"
                >
                    Textures Originales. Performance Garantie. Universalité.
                </motion.p>
            </div>

            {/* Ken Burns Effect Container */}
            <div className="w-full h-[400px] md:h-[600px] relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/about/textures-macro.jpg')" }}
                    initial={{ scale: 1.0, x: "0%" }}
                    whileInView={{ scale: 1.1, x: "-5%" }} // Subtle slow pan & zoom
                    viewport={{ once: true }}
                    transition={{ duration: 15, ease: "linear" }}
                />
            </div>
        </section>
    );
};
