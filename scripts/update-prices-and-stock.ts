
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const priceUpdates: Record<string, number> = {
    // Slug mappings
    'bronzing-powder': 99,
    'compact-powder': 120,
    'concealer-stick': 80,
    'crayon-khol-waterproof': 69,      // FL293
    'khol-pencil-wp': 55,              // FL225 (khol pencil waterproof)
    'eyebrow-kit': 125,
    'eyebrow-pen-longwear': 55,
    'eyebrow-pencil': 55,
    'eyeliner-wp': 99,
    'felt-tip-liner': 90,
    'felt-tip-matte-waterproof': 99,
    'foundation-spf-10': 150,
    'french-manicure': 130,
    'full-lash-mascara': 89,
    'gel-like-nail-polish': 50,
    'gloss-long-tenue-mat': 99,
    'high-volume-mascara': 95,
    'highlighting-powder': 90,
    'khol-eyebrow-pencil': 60,
    'lash-and-brow-mascara-gel': 80,
    'lip-pencil-le-chic': 55,
    'lipstick-rosso-le-chic': 95,
    'lipstick-rouge': 85,              // le rouge lipstick
    'loose-powder': 89,
    'super-lash-mascara': 120,         // FL 275
    'matte-liquid-lipstick': 80,
    'mattifying-lasting-foundation': 130,
    'nail-care': 60,
    'nail-polish': 55,
    'nail-polish-easy-flo': 50,
    'nail-polish-laque-plus': 55,
    'primer-makeup-base': 130,
    'smokey-eyes-palette': 120,        // Eye palette
    'soft-eye-pencil-wp': 50,
    'stick-foundation': 125,
    'twin-eyebrow': 75,
    'ultra-black-eyeliner-and-khol-waterproof': 60,
    'velvet-lipstick': 75,
    'waterliner-kajal-pencil': 50,
    'waterproof-lip-pencil': 70,
    'wet-and-dry-blush': 99,
    'wet-and-dry-eyeshadow': 90,
    'concealer-pencil': 80, // Assuming similar to stick if not found, but it is in DB. Image didn't specify pencil, only stick. Wait.
    // Correction: "Concealer stick" 80. "Concealer Pencil" is 115 in DB. I won't touch pencil unless image implies.
    // Image 7: "Concealer stick" 80 dhs. No pencil shown. I will REMOVE concealer-pencil from this list.
};

// Remove explicit non-matches if I accidentally added them above.
delete priceUpdates['concealer-pencil'];

async function main() {
    console.log("🚀 Starting Bulk Update...");

    // 1. Update Prices
    for (const [slug, newPrice] of Object.entries(priceUpdates)) {
        try {
            await prisma.product.update({
                where: { slug },
                data: { price: newPrice }
            });
            console.log(`✅ Updated price for ${slug} to ${newPrice} MAD`);
        } catch (e) {
            console.warn(`⚠️ Could not update ${slug}. Product might not exist.`);
        }
    }

    // 2. Reset Stock for ALL products
    console.log("📦 Resetting stock for ALL products to 10...");
    const updateResult = await prisma.product.updateMany({
        data: { stock: 10 }
    });
    console.log(`✅ Stock reset for ${updateResult.count} products.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
