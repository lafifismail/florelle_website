export type Category = 'Eyes' | 'Lips' | 'Face' | 'Nails' | 'Accessories';

export type SubCategory =
    | 'Mascara' | 'Eyeliner' | 'Kajal' | 'Eyeshadow' | 'Eyebrows'
    | 'Lipstick' | 'Gloss' | 'Lip Pencil'
    | 'Foundation' | 'Powder' | 'Blush' | 'Concealer' | 'Contouring & Highlight' | 'Base'
    | 'Nail Polish' | 'French Manicure' | 'Nail Care'
    | 'Sharpeners';

export interface Variant {
    id: string;
    name: string; // Shade name or number
    colorCode?: string; // Hex code for UI representation
    stock: number;
    images: string[];
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    category: Category;
    subcategory: SubCategory;
    description: string;
    price: number; // in MAD
    features?: string[]; // e.g. ["Waterproof", "Long-lasting"]
    variants: Variant[];
    mainImage: string;
}
