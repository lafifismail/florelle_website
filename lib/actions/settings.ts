'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
    let settings = await prisma.siteSettings.findUnique({
        where: { id: "default" }
    });

    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: { id: "default" }
        });
    }

    return settings;
}

export async function updatePromoBanner(data: {
    visible?: boolean;
    imageUrl?: string;
    text?: string;
    link?: string;
}) {
    // Ensure default settings exist logic could also be here, but usually safe to upsert
    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: {
            promoBannerVisible: data.visible,
            promoBannerImageUrl: data.imageUrl,
            promoBannerText: data.text,
            promoBannerLink: data.link
        },
        create: {
            id: "default",
            promoBannerVisible: data.visible || false,
            promoBannerImageUrl: data.imageUrl,
            promoBannerText: data.text,
            promoBannerLink: data.link
        }
    });

    revalidatePath('/');
    return { success: true };
}

export async function togglePromoVisibility(visible: boolean) {
    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: { promoBannerVisible: visible },
        create: { id: "default", promoBannerVisible: visible }
    });

    revalidatePath('/');
    revalidatePath('/');
    return { success: true };
}

export async function updateUniverseBanner(universe: 'eyes' | 'lips' | 'face' | 'nails', imageUrl: string) {
    const fieldMap = {
        'eyes': 'eyesBannerUrl',
        'lips': 'lipsBannerUrl',
        'face': 'faceBannerUrl',
        'nails': 'nailsBannerUrl'
    };

    const fieldName = fieldMap[universe];

    // Using any to bypass TS check since client might not be regenerated yet
    const data: any = {};
    data[fieldName] = imageUrl;

    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: data,
        create: { id: "default", ...data }
    });

    revalidatePath('/');
    return { success: true };
}
