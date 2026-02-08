import { PrismaClient } from '@prisma/client';
import cloudinary from '../lib/cloudinary';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateImages() {
    console.log('🚀 Starting image migration to Cloudinary...\n');

    try {
        // Fetch all products
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                images: true,
            },
        });

        console.log(`📦 Found ${products.length} products to check.\n`);

        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                // Parse images (may be JSON string or array)
                let images: string[] = [];
                if (typeof product.images === 'string') {
                    images = JSON.parse(product.images);
                } else if (Array.isArray(product.images)) {
                    images = product.images as string[];
                }

                // Check if product has local images that need migration
                const localImages = images.filter(img => img.startsWith('/uploads/'));

                if (localImages.length === 0) {
                    console.log(`⏭️  Skipping "${product.name}" (already using Cloudinary)`);
                    skippedCount++;
                    continue;
                }

                console.log(`📤 Migrating "${product.name}" (${localImages.length} images)...`);

                const newImages: string[] = [];

                for (const localPath of localImages) {
                    const filePath = path.join(process.cwd(), 'public', localPath);

                    // Check if file exists
                    if (!fs.existsSync(filePath)) {
                        console.log(`   ⚠️  File not found: ${localPath}`);
                        continue;
                    }

                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(filePath, {
                        folder: 'florelle-products',
                    });

                    newImages.push(result.secure_url);
                    console.log(`   ✅ Uploaded: ${path.basename(localPath)}`);
                }

                // Update product with new Cloudinary URLs
                if (newImages.length > 0) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { images: newImages },
                    });

                    console.log(`   💾 Updated database for "${product.name}"\n`);
                    migratedCount++;
                } else {
                    console.log(`   ❌ No images could be migrated for "${product.name}"\n`);
                    errorCount++;
                }

            } catch (error: any) {
                console.error(`❌ Error migrating "${product.name}":`, error.message);
                errorCount++;
            }
        }

        console.log('\n✨ Migration complete!');
        console.log(`   ✅ Migrated: ${migratedCount} products`);
        console.log(`   ⏭️  Skipped: ${skippedCount} products (already on Cloudinary)`);
        console.log(`   ❌ Errors: ${errorCount} products\n`);

    } catch (error) {
        console.error('Fatal error during migration:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateImages();
