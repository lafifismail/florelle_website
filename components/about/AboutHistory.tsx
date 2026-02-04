'use client';

import { motion } from 'framer-motion';

export const AboutHistory = () => {
    return (
        <section className="py-24 px-4 md:px-12 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <div className="w-12 h-[1px] bg-gold" />
                    <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Née à Milan.</h2>
                    <p className="text-charcoal/70 leading-relaxed text-lg font-light">
                        Fondée en 1993 en Italie, Florelle est née d'une vision simple : offrir une qualité professionnelle à un prix juste. D'abord plébiscitée en Italie et en Suisse, la marque a conquis plus de 35 pays à travers l'Europe, l'Asie et maintenant l'Afrique.
                    </p>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative aspect-[3/4] md:aspect-[4/5]"
                >
                    <div className="absolute inset-0 bg-gray-200 overflow-hidden rounded-sm shadow-2xl">
                        <img
                            src="/about/story-milan.jpg"
                            alt="Histoire de Florelle à Milan"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
