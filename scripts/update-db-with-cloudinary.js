const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const MAPPING_FILE = path.join(__dirname, 'cloudinary-mapping.json');

async function updateDatabase() {
    console.log('🔄 UPDATING DATABASE WITH CLOUDINARY URLS\n');

    // Load URL mapping
    if (!fs.existsSync(MAPPING_FILE)) {
        console.error('❌ Mapping file not found! Run upload-to-cloudinary.js first.');
        process.exit(1);
    }

    const urlMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    console.log(`📋 Loaded ${Object.keys(urlMapping).length} URL mappings\n`);

    // Get all products
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            images: true
        }
    });

    console.log(`📦 Found ${products.length} products in database\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
        try {
            // Parse current images
            let imageUrls = [];
            if (Array.isArray(product.images)) {
                imageUrls = product.images;
            } else if (typeof product.images === 'string') {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed)) {
                    imageUrls = parsed;
                }
            }

            if (imageUrls.length === 0) {
                console.log(`⏭️  Skipping ${product.name} (no images)`);
                skipped++;
                continue;
            }

            // Replace local paths with Cloudinary URLs
            const updatedUrls = imageUrls.map(url => {
                if (urlMapping[url]) {
                    return urlMapping[url];
                }
                // If not found in mapping, keep original (might already be Cloudinary URL)
                return url;
            });

            // Check if any URLs were updated
            const hasChanges = updatedUrls.some((url, i) => url !== imageUrls[i]);

            if (!hasChanges) {
                console.log(`⏭️  Skipping ${product.name} (already using Cloudinary)`);
                skipped++;
                continue;
            }

            // Update product
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    images: JSON.stringify(updatedUrls)
                }
            });

            console.log(`✅ Updated ${product.name}`);
            console.log(`   Old: ${imageUrls[0]}`);
            console.log(`   New: ${updatedUrls[0]}`);
            updated++;

        } catch (error) {
            console.error(`❌ Error updating ${product.name}:`, error.message);
            errors++;
        }
    }

    await prisma.$disconnect();

    console.log('\n\n🎉 DATABASE UPDATE COMPLETE!\n');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log('\n🚀 Images should now load on Vercel!');
}

updateDatabase().catch(console.error);
