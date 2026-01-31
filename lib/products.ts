import productsData from '@/data/products.json';
import { Product, Category, SubCategory } from './types';

export const getAllProducts = (): Product[] => {
    return productsData as Product[];
};

export const getProductsByCategory = (category: string): Product[] => {
    // Case-insensitive match or direct cast if we trust input
    return getAllProducts().filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
    );
};

export const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
    return getAllProducts().filter(
        (p) =>
            p.category.toLowerCase() === category.toLowerCase() &&
            p.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
};

export const getProductBySlug = (slug: string): Product | undefined => {
    return getAllProducts().find((p) => p.slug === slug);
};

/**
 * Returns all available categories and their subcategories
 * Useful for navigation and breadcrumbs
 */
export const getShopStructure = () => {
    const structure: Record<string, Set<string>> = {};

    getAllProducts().forEach(p => {
        if (!structure[p.category]) {
            structure[p.category] = new Set();
        }
        structure[p.category].add(p.subcategory);
    });

    return Object.fromEntries(
        Object.entries(structure).map(([cat, subs]) => [cat, Array.from(subs)])
    );
};
