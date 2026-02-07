'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '@/lib/actions/product';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
interface Product {
    id: string;
    name: string;
    description?: string;
    price: number | string;
    salePrice?: number | string;
    stock: number;
    images: string[] | string;
    categoryId: string;
    subcategory?: string;
    isFeatured: boolean;
}

interface ProductFormProps {
    readonly initialData?: Partial<Product>;
    readonly categories: { readonly id: string; readonly name: string }[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Subcategory options based on category name
    const subcategoryOptions: Record<string, string[]> = {
        'Lips': ['Lipstick', 'Gloss', 'Lip Pencil'],
        'Eyes': ['Mascara', 'Eyeliners', 'Eyeshadows', 'Pencil'],
        'Face': ['Foundation', 'Powder', 'Blushes'],
        'Nails': ['Nail Polish', 'Nail Care', 'French Manicure'],
        'Accessories': ['Sharpeners']
    };

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        salePrice: initialData?.salePrice || '',
        stock: initialData?.stock || 0,
        categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
        subcategory: initialData?.subcategory || '',
        isFeatured: initialData?.isFeatured || false,
    });

    // Get current category name for subcategory options
    const currentCategory = categories.find(c => c.id === formData.categoryId);
    const availableSubcategories = currentCategory ? (subcategoryOptions[currentCategory.name] || []) : [];

    // Handle existing images and new files separately
    const [existingImages, setExistingImages] = useState<string[]>(
        initialData?.images ? (Array.isArray(initialData.images) ? initialData.images : JSON.parse(initialData.images as string)) : []
    );
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        setNewFiles(prev => [...prev, ...files]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewFiles(prev => [...prev, ...files]);
        }
    };

    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedUrls: string[] = [];

            // Upload new files if any
            if (newFiles.length > 0) {
                const uploadFormData = new FormData();
                newFiles.forEach(file => {
                    uploadFormData.append('files', file);
                });

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    const error = await uploadResponse.json();
                    throw new Error(error.error || 'Upload failed');
                }

                const { urls } = await uploadResponse.json();
                uploadedUrls = urls;
            }

            // Combine existing images with newly uploaded ones
            const allImages = [...existingImages, ...uploadedUrls];

            if (allImages.length === 0) {
                alert("Veuillez ajouter au moins une image");
                setLoading(false);
                return;
            }

            const result = await upsertProduct({
                ...formData,
                images: allImages,
                id: initialData?.id
            });

            if (result && (result as any).error) { // Handle potential error structure if we change backend later
                throw new Error((result as any).error);
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-sm shadow-sm border border-beige/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Nom du produit *</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            placeholder="Ex: Rouge à Lèvres Mat"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors resize-none"
                            placeholder="Description détaillée..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Prix (MAD) *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="any"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Prix Promo (Optionnel)</label>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={formData.salePrice}
                                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Stock *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value, 10) || 0 })}
                                className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Catégorie *</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategory: '' })}
                                className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            >
                                <option value="" disabled>Choisir une catégorie</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subcategory field - only show if category has subcategories */}
                    {availableSubcategories.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Sous-catégorie</label>
                            <select
                                value={formData.subcategory}
                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                className="w-full border-b border-beige/40 py-2 focus:border-gold outline-none bg-transparent transition-colors"
                            >
                                <option value="">Aucune</option>
                                {availableSubcategories.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Featured Product Checkbox */}
                    <div className="space-y-2 pt-4 border-t border-beige/10">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded border-beige/40 text-gold focus:ring-gold focus:ring-offset-0"
                            />
                            <span className="text-sm text-charcoal group-hover:text-gold transition-colors">
                                🌟 <strong>Mettre dans les Incontournables</strong> (Affichage sur la page d'accueil)
                            </span>
                        </label>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Images du produit *</label>

                        {/* Drag and Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${dragActive ? 'border-gold bg-gold/5' : 'border-beige/40 hover:border-gold/50'
                                }`}
                        >
                            <Upload className="mx-auto mb-4 text-charcoal/30" size={32} />
                            <p className="text-sm text-charcoal/60 mb-2">Glissez vos images ici</p>
                            <p className="text-xs text-charcoal/40 mb-4">ou</p>
                            <label className="cursor-pointer">
                                <span className="text-xs uppercase tracking-widest text-gold hover:text-gold-dark font-bold">
                                    Parcourir les fichiers
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Image Previews */}
                        {(existingImages.length > 0 || newFiles.length > 0) && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {/* Existing Images */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square bg-white border border-beige/20 rounded overflow-hidden group">
                                        <Image
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* New Files */}
                                {newFiles.map((file, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square bg-white border border-beige/20 rounded overflow-hidden group">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Nouveau ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[8px] px-1 py-0.5 uppercase tracking-wider">
                                            Nouveau
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-beige/10 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
                    Annuler
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Sauvegarder le produit'}
                </Button>
            </div>
        </form>
    );
}
