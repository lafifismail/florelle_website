import { getSiteSettings } from "@/lib/actions/settings";
import Link from "next/link";
import Image from "next/image";

export default async function PromoBanner() {
    const settings = await getSiteSettings();

    if (!settings?.promoBannerVisible || !settings?.promoBannerImageUrl) {
        return null;
    }

    return (
        <section className="w-full bg-off-white animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="relative w-full rounded-sm overflow-hidden group cursor-pointer flex justify-center">
                    <Image
                        src={settings.promoBannerImageUrl}
                        alt="Vente Flash Florelle"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full md:w-auto h-auto max-h-[600px] object-contain shadow-luxury transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    {/* Optional Overlay or Text if needed later */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>
        </section>
    );
}
