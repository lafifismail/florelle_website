'use client';

import { useState } from 'react';
import { updatePromoBanner, togglePromoVisibility, updateUniverseBanner } from '@/lib/actions/settings';
import { Upload, Save, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PromoSettings({ initialSettings }: { initialSettings: any }) {
    const [isVisible, setIsVisible] = useState<boolean>(!!initialSettings?.promoBannerVisible);
    const [imageUrl, setImageUrl] = useState<string>(initialSettings?.promoBannerImageUrl ?? '');
    const [loading, setLoading] = useState(false);

    // Universe States
    const [banners, setBanners] = useState({
        eyes: initialSettings?.eyesBannerUrl || '/images/banners/eyes/eyes-small-banner.png',
        lips: initialSettings?.lipsBannerUrl || '/images/banners/lips/lips-small-banner.png',
        face: initialSettings?.faceBannerUrl || '/images/banners/face/face-small-banner.png',
        nails: initialSettings?.nailsBannerUrl || '/images/banners/nails/nails-small-banner.png',
    });

    const [uploading, setUploading] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null);

    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        const newState = !isVisible;
        setIsVisible(newState);
        await togglePromoVisibility(newState);
        router.refresh();
        setLoading(false);
    };

    const handleSave = async () => {
        setLoading(true);
        await updatePromoBanner({ visible: isVisible, imageUrl });
        router.refresh();
        setLoading(false);
        alert('Bannière mise à jour !');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'promo' | 'eyes' | 'lips' | 'face' | 'nails') => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);

        if (target === 'promo') setLoading(true);
        else setUploading(target);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.urls?.[0]) {
                const newUrl = data.urls[0];
                if (target === 'promo') {
                    setImageUrl(newUrl);
                    alert('Image téléchargée ! Pensez à sauvegarder.');
                } else {
                    setBanners(prev => ({ ...prev, [target]: newUrl }));
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'upload");
        } finally {
            if (target === 'promo') setLoading(false);
            else setUploading(null);
        }
    };

    const handleUniverseSave = async (universe: 'eyes' | 'lips' | 'face' | 'nails') => {
        setSaving(universe);
        try {
            await updateUniverseBanner(universe, banners[universe]);
            router.refresh();
            // Optional: better feedback than alert
        } catch (e) {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="space-y-10">
            {/* Promo Banner Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-beige/10">
                    <h4 className="font-serif text-charcoal text-sm font-bold uppercase tracking-wider">Bannière Promotionnelle</h4>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-xs font-medium text-charcoal/60">
                                {isVisible ? 'Active' : 'Masquée'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors ${isVisible
                                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                : 'bg-green-50 text-green-500 hover:bg-green-100'
                                }`}
                        >
                            {loading ? <Loader2 size={10} className="animate-spin" /> : (isVisible ? 'Désactiver' : 'Activer')}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block">Image de la bannière</label>
                        <div className="flex gap-2">
                            <div className="flex-grow relative">
                                <input
                                    suppressHydrationWarning
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-off-white border border-beige/20 p-2 pl-3 pr-10 text-sm focus:border-gold outline-none rounded-sm transition-colors"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <div className="relative group cursor-pointer">
                                        <Upload size={14} className="text-charcoal/40 group-hover:text-gold transition-colors" />
                                        <input
                                            suppressHydrationWarning
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'promo')}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-charcoal text-white px-4 rounded-sm hover:bg-gold transition-colors flex items-center gap-2"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Sauvegarder</span>
                            </button>
                        </div>
                    </div>
                </div>

                {imageUrl && (
                    <div className="mt-4 relative aspect-[21/9] bg-gray-100 rounded-sm overflow-hidden border border-beige/10 group">
                        <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <p className="text-white text-xs font-bold uppercase tracking-widest">Aperçu</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Universe Banners Section */}
            <div className="space-y-6 pt-6 border-t border-beige/10">
                <h4 className="font-serif text-charcoal text-sm font-bold uppercase tracking-wider mb-4">Parcourir par Univers</h4>

                <div className="grid grid-cols-1 gap-4">
                    {(['eyes', 'lips', 'face', 'nails'] as const).map((universe) => (
                        <div key={universe} className="bg-white p-4 rounded-sm border border-beige/10 flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-gold/30 transition-colors">

                            {/* Preview Thumbnail */}
                            <div className="w-full md:w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative border border-beige/10">
                                {banners[universe] ? (
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${banners[universe]})` }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                                        <Upload size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex-grow w-full space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gold">{universe}</label>
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-grow relative">
                                        <input
                                            suppressHydrationWarning
                                            type="text"
                                            value={banners[universe]}
                                            onChange={(e) => setBanners(prev => ({ ...prev, [universe]: e.target.value }))}
                                            className="w-full bg-off-white border border-beige/20 p-2 pl-3 pr-10 text-xs focus:border-gold outline-none rounded-sm transition-colors text-charcoal/80"
                                            placeholder={`URL pour ${universe}`}
                                        />

                                        {/* Inline File Upload */}
                                        <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center border-l border-beige/10 hover:bg-gold/10 transition-colors cursor-pointer">
                                            {uploading === universe ? (
                                                <Loader2 size={12} className="animate-spin text-gold" />
                                            ) : (
                                                <Upload size={12} className="text-charcoal/40" />
                                            )}
                                            <input
                                                suppressHydrationWarning
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, universe)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={!!uploading}
                                                title="Télécharger une image"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUniverseSave(universe)}
                                        disabled={!!saving || !!uploading}
                                        className={`px-3 rounded-sm transition-all flex items-center justify-center gap-2 min-w-[40px] ${saving === universe
                                            ? 'bg-green-500 text-white'
                                            : 'bg-charcoal text-white hover:bg-gold'
                                            }`}
                                        title="Enregistrer"
                                    >
                                        {saving === universe ? <Check size={14} /> : <Save size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
