'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Plus, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';

interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly images: string[] | string;
    readonly isFeatured: boolean;
    readonly category?: { readonly id: string; readonly name: string };
    readonly subcategory?: string;
}

interface Category {
    readonly id: string;
    readonly name: string;
}

interface FeaturedProductsManagerProps {
    readonly initialFeatured: Product[];
    readonly allProducts: Product[];
    readonly categories: Category[];
}

export function FeaturedProductsManager({ initialFeatured, allProducts, categories }: Readonly<FeaturedProductsManagerProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [activeTab, setActiveTab] = useState<'selected' | 'add'>('selected');
    const [featured, setFeatured] = useState<Product[]>(initialFeatured);
    const [loading, setLoading] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Robust Body Scroll Lock
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    const getImageUrl = (images: string[] | string): string => {
        try {
            if (Array.isArray(images) && images.length > 0) return images[0];
            if (typeof images === 'string') {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
            }
        } catch { }
        return '/images/placeholder.jpg';
    };

    // Get unique subcategories based on selected category
    const subcategories = useMemo(() => {
        if (!selectedCategory) return [];
        const subs = new Set<string>();
        allProducts.forEach(p => {
            if (p.subcategory && p.category?.id === selectedCategory) {
                subs.add(p.subcategory);
            }
        });
        return Array.from(subs).sort();
    }, [allProducts, selectedCategory]);

    // Filter products for "Add" tab - SHOW ALL matching category/search
    const availableProducts = useMemo(() => {
        let products = [...allProducts];

        if (selectedCategory) {
            products = products.filter(p => p.category?.id === selectedCategory);
        }
        if (selectedSubcategory) {
            products = products.filter(p => p.subcategory === selectedSubcategory);
        }
        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return products;
    }, [allProducts, selectedCategory, selectedSubcategory, searchTerm]);

    // Pagination calculations
    const totalPages = Math.ceil(availableProducts.length / itemsPerPage);
    const paginatedProducts = availableProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const toggleFeatured = async (productId: string, shouldBeFeatured: boolean) => {
        setLoading(productId);
        try {
            const res = await fetch('/api/products/featured', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, isFeatured: shouldBeFeatured }),
            });

            if (res.ok) {
                if (shouldBeFeatured) {
                    const product = allProducts.find(p => p.id === productId);
                    if (product) setFeatured(prev => [...prev, product]);
                } else {
                    setFeatured(prev => prev.filter(p => p.id !== productId));
                }
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
        setLoading(null);
    };

    const handleTabChange = (tab: 'selected' | 'add') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        setSelectedSubcategory('');
        setCurrentPage(1);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const modalContent = isOpen && (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300"
            onClick={closeModal}
        >
            {/* Modal Content */}
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 h-full max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-charcoal text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Sparkles className="text-gold" size={24} />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl">Produits Incontournables</h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-light mt-0.5">Manager Editorial</p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-beige/20 shrink-0 bg-off-white/30">
                    <button
                        onClick={() => handleTabChange('selected')}
                        className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'selected' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal hover:bg-off-white'}`}
                    >
                        Produits Sélectionnés ({featured.length})
                        {activeTab === 'selected' && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold animate-in slide-in-from-left-full duration-300" />}
                    </button>
                    <button
                        onClick={() => handleTabChange('add')}
                        className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'add' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal hover:bg-off-white'}`}
                    >
                        Ajouter un Produit
                        {activeTab === 'add' && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold animate-in slide-in-from-right-full duration-300" />}
                    </button>
                </div>

                {/* Filters Section (Only for Add tab) */}
                {activeTab === 'add' && (
                    <div className="p-4 border-b border-beige/10 bg-off-white/10 shrink-0 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-beige/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-beige/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSubcategory}
                                onChange={(e) => { setSelectedSubcategory(e.target.value); setCurrentPage(1); }}
                                disabled={!selectedCategory || subcategories.length === 0}
                                className="flex-1 px-3 py-2 bg-white border border-beige/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <option value="">{selectedCategory && subcategories.length === 0 ? 'Aucune sous-catégorie' : 'Toutes les sous-catégories'}</option>
                                {subcategories.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Product List Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {activeTab === 'selected' ? (
                        /* Selected List */
                        featured.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-charcoal/20 py-12">
                                <Sparkles size={64} className="mb-4 opacity-10" />
                                <p className="text-xl font-serif">Aucun produit sélectionné</p>
                                <button
                                    onClick={() => setActiveTab('add')}
                                    className="mt-4 text-gold hover:underline text-sm font-medium"
                                >
                                    Commencer la sélection
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {featured.map(product => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-3 bg-white border border-beige/10 rounded-xl hover:shadow-md transition-all group scale-in"
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-beige/20 bg-off-white shrink-0">
                                            <Image
                                                src={getImageUrl(product.images)}
                                                alt={product.name}
                                                width={64} height={64}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-charcoal truncate">{product.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gold font-bold">{product.price} MAD</span>
                                                <span className="text-[10px] text-charcoal/30 px-1.5 py-0.5 bg-off-white rounded-md uppercase">{product.category?.name}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFeatured(product.id, false)}
                                            disabled={loading === product.id}
                                            className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 active:scale-90"
                                            title="Supprimer"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        /* Add List */
                        paginatedProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-charcoal/20 py-12">
                                <Search size={64} className="mb-4 opacity-10" />
                                <p className="text-xl font-serif">Aucun produit trouvé</p>
                                <p className="text-sm mt-2 opacity-60">Essayez de modifier vos filtres ou votre recherche</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {paginatedProducts.map(product => {
                                    const isAlreadyFeatured = featured.some(f => f.id === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className={`flex items-center gap-4 p-3 bg-white border rounded-xl transition-all group scale-in ${isAlreadyFeatured ? 'border-gold/30 bg-gold/5' : 'border-beige/10 hover:shadow-md'}`}
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-beige/20 bg-off-white shrink-0">
                                                <Image
                                                    src={getImageUrl(product.images)}
                                                    alt={product.name}
                                                    width={64} height={64}
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-charcoal truncate">{product.name}</p>
                                                    {isAlreadyFeatured && (
                                                        <span className="text-[10px] bg-gold text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                                                            DÉJÀ AJOUTÉ
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-charcoal/50">{product.price} MAD</span>
                                                    <span className="text-[10px] text-charcoal/30 px-1.5 py-0.5 bg-off-white rounded-md uppercase">{product.category?.name}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => !isAlreadyFeatured && toggleFeatured(product.id, true)}
                                                disabled={loading === product.id || isAlreadyFeatured}
                                                className={`p-2.5 rounded-lg transition-all active:scale-95 ${isAlreadyFeatured ? 'text-gold bg-gold/10' : 'bg-gold/5 text-gold hover:bg-gold hover:text-white disabled:opacity-50'}`}
                                            >
                                                {isAlreadyFeatured ? <Sparkles size={20} /> : <Plus size={20} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>

                {/* Footer - Pagination */}
                {activeTab === 'add' && totalPages > 1 && (
                    <div className="p-4 border-t border-beige/10 bg-off-white/30 shrink-0 flex items-center justify-between">
                        <span className="text-xs text-charcoal/40 font-medium ml-2">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md border border-beige/30 text-charcoal/60 hover:bg-white hover:text-charcoal disabled:opacity-20 transition-all font-bold"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-1 mx-1">
                                {getVisiblePages().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${currentPage === page ? 'bg-gold text-white shadow-lg' : 'bg-white border border-beige/30 text-charcoal/60 hover:bg-off-white hover:text-gold'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md border border-beige/30 text-charcoal/60 hover:bg-white hover:text-charcoal disabled:opacity-20 transition-all font-bold"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Status bar */}
                <div className="px-6 py-2 bg-charcoal text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold text-center shrink-0">
                    Florelle Admin Workflow • Featured Manager V2.0
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Trigger Button - Card Style */}
            <div className="group relative">
                <button
                    onClick={() => setIsOpen(true)}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    onMouseLeave={() => setIsPressed(false)}
                    className={`w-full flex items-center justify-between p-4 bg-white hover:bg-off-white rounded-lg border border-beige/30 shadow-sm transition-all duration-300 ${isPressed ? 'scale-[0.98]' : 'hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-gold/10 p-2.5 rounded-full text-gold group-hover:scale-110 transition-transform duration-300">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg text-charcoal">Produits Incontournables</h3>
                            <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-0.5">Gestion Page d'accueil</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {featured.length}
                        </span>
                        <ChevronRight size={18} className="text-beige group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>

            {/* Modal Overlay */}
            {mounted && createPortal(modalContent, document.body)}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(193, 155, 118, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(193, 155, 118, 0.4);
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}
