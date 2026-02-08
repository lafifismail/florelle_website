require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImageUrls() {
    console.log('🔍 Vérification détaillée des URLs images...\n');

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            images: true
        }
    });

    let cloudinaryCount = 0;
    let localCount = 0;
    let invalidCount = 0;
    let problematicProducts = [];

    for (const product of products) {
        let imageUrls = [];
        try {
            if (Array.isArray(product.images)) {
                imageUrls = product.images;
            } else if (typeof product.images === 'string') {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed)) {
                    imageUrls = parsed;
                }
            }
        } catch (e) {
            console.error(`❌ Erreur parsing ${product.name}:`, e.message);
            invalidCount++;
            continue;
        }

        if (imageUrls.length === 0) {
            console.log(`⚠️  ${product.name}: Aucune image`);
            invalidCount++;
            continue;
        }

        const firstImage = imageUrls[0];

        // Check if Cloudinary
        if (firstImage.includes('cloudinary.com')) {
            cloudinaryCount++;

            // Check for malformed URLs
            if (firstImage.includes('.jpg.jpg') ||
                firstImage.includes('.png.png') ||
                firstImage.includes('undefined') ||
                !firstImage.startsWith('https://')) {
                problematicProducts.push({
                    name: product.name,
                    url: firstImage,
                    issue: 'URL malformée'
                });
            }
        } else {
            localCount++;
            problematicProducts.push({
                name: product.name,
                url: firstImage,
                issue: 'Chemin local (pas Cloudinary)'
            });
        }
    }

    console.log('\n📊 STATISTIQUES:\n');
    console.log(`   Total produits: ${products.length}`);
    console.log(`   ✅ Cloudinary URLs: ${cloudinaryCount}`);
    console.log(`   📁 Chemins locaux: ${localCount}`);
    console.log(`   ❌ Invalides: ${invalidCount}`);

    if (problematicProducts.length > 0) {
        console.log('\n\n🚨 PRODUITS PROBLÉMATIQUES:\n');
        problematicProducts.forEach(p => {
            console.log(`❌ ${p.name}`);
            console.log(`   Issue: ${p.issue}`);
            console.log(`   URL: ${p.url}`);
            console.log('');
        });
    } else {
        console.log('\n✅ Toutes les URLs sont correctes!');
    }

    await prisma.$disconnect();
}

checkImageUrls();
