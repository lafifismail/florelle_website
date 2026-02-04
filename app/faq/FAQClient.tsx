'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// FAQ Data
const faqData = [
    {
        question: "Vos produits sont-ils vraiment italiens ?",
        answer: "Oui, absolument. Tous nos produits sont formulés, fabriqués et testés en Italie, près de Milan. Florelle est une marque historique reconnue pour son expertise cosmétique."
    },
    {
        question: "Quels sont les délais et frais de livraison ?",
        answer: "Nous livrons partout au Maroc. À Casablanca et Mohammedia, la livraison est de 25 MAD (24h-48h). Pour les autres villes, elle est de 45 MAD (2 à 4 jours ouvrés). La livraison est offerte dès 400 MAD (Casa) ou 600 MAD (National)."
    },
    {
        question: "Comment se passe le paiement ?",
        answer: "Le paiement se fait à la livraison (Cash on Delivery). Vous ne payez qu'une fois votre colis reçu, en espèces auprès du livreur."
    },
    {
        question: "Puis-je retourner un produit ?",
        answer: "Pour des raisons strictes d'hygiène, nous n'acceptons pas les retours de produits ouverts ou testés. Si le produit est scellé, vous avez 7 jours pour nous contacter."
    },
    {
        question: "Comment choisir ma teinte de fond de teint ?",
        answer: "Nos expertes sont là pour vous ! Contactez-nous sur WhatsApp au 06 XX XX XX XX avec une photo à la lumière naturelle pour un conseil personnalisé."
    },
    {
        question: "Vos produits sont-ils testés sur les animaux ?",
        answer: "Non. Conformément à la réglementation européenne, aucun produit Florelle n'est testé sur les animaux (Cruelty-Free)."
    }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-gray-100 last:border-none">
            <button
                className="w-full py-6 flex items-center justify-between text-left group hover:text-[#E30039] transition-colors duration-300"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className={`font-serif text-lg md:text-xl text-charcoal group-hover:text-[#E30039] transition-colors duration-300 ${isOpen ? 'text-[#E30039]' : ''}`}>
                    {question}
                </span>
                <span className={`ml-4 flex-shrink-0 text-charcoal/40 group-hover:text-[#E30039] transition-colors duration-300 ${isOpen ? 'text-[#E30039]' : ''}`}>
                    {isOpen ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
                </span>
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'
                    }`}
            >
                <div className="overflow-hidden">
                    <p className="text-charcoal/70 leading-relaxed font-light text-base md:text-lg max-w-2xl">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export function FAQClient() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-6">
            {/* Header */}
            <header className="text-center mb-16 space-y-4">
                <h1 className="font-serif text-4xl md:text-5xl text-charcoal">Questions Fréquentes</h1>
                <p className="text-lg text-charcoal/60 font-light italic">
                    Tout ce que vous devez savoir sur l'expérience Florelle.
                </p>
            </header>

            {/* FAQ Grid */}
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-50 mb-16">
                {faqData.map((item, index) => (
                    <AccordionItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>

            {/* Footer Contact CTA */}
            <div className="text-center space-y-6">
                <p className="font-serif text-2xl text-charcoal">Vous avez encore une question ?</p>
                <Link href="/contact" className="inline-block">
                    <Button variant="secondary" className="pl-8 pr-6 py-4 text-sm bg-charcoal text-white hover:bg-[#E30039] border-none shadow-none group">
                        Nous Contacter
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
