require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(__dirname, '..', 'public');

// The last problematic product - search by name instead of image path
const productMapping = [
    {
        name: 'Lash & Brow Mascara Gel',
        localPath: '/images/products/eyes/mascara/lash-&-brow-mascara-gel.jpg',
    },
    {
        name: 'Ultra Black Eyeliner & Khol Waterproof',
        localPath: '/images/products/eyes/eyeliners/ultra-black-eyeliner-&-khol-waterproof.jpg',
    },
    {
        name: 'Wet & Dry Eyeshadow',
        localPath: '/images/products/eyes/eyeshadows/wet-&-dry-eyeshadow.jpg',
    },
    {
        name: 'Wet & Dry Blush',
        localPath: '/images/products/face/blushes/wet-&-dry-blush.jpeg',
    }
];

async function uploadAndFixByName() {
    console.log('🔧 Correction des produits avec & dans le nom...\n');

    for (const item of productMapping) {
        const localPath = path.join(IMAGES_DIR, item.localPath.replace(/\//g, path.sep));

        console.log(`\n📦 ${item.name}`);
        console.log(`   Fichier: ${item.localPath}`);

        // Check if file exists
        if (!fs.existsSync(localPath)) {
            console.log(`   ❌ Fichier introuvable\n`);
            continue;
        }

        try {
            // Generate clean public_id
            const relativePath = item.localPath.replace('/images/products/', '');
            const cleanPath = relativePath
                .replace(/&/g, 'and')
                .replace(/\s+/g, '-');
            const publicId = 'florelle/products/' + cleanPath.replace(/\.(jpg|jpeg|png)$/i, '');

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(localPath, {
                public_id: publicId,
                folder: 'florelle/products',
                resource_type: 'image',
                overwrite: true
            });

            console.log(`   ✅ Uploaded to Cloudinary`);
            console.log(`   URL: ${result.secure_url.substring(0, 70)}...`);

            // Find product by name
            const products = await prisma.product.findMany({
                where: {
                    name: {
                        contains: item.name
                    }
                }
            });

            if (products.length === 0) {
                console.log(`   ⚠️  Produit non trouvé dans la DB!`);
                continue;
            }

            console.log(`   📦 Trouvé ${products.length} produit(s)`);

            for (const product of products) {
                // Parse current images
                let imageUrls = [];
                if (typeof product.images === 'string') {
                    imageUrls = JSON.parse(product.images);
                } else if (Array.isArray(product.images)) {
                    imageUrls = product.images;
                }

                // Replace local path with Cloudinary URL
                const updatedUrls = imageUrls.map(url =>
                    url === item.localPath ? result.secure_url : url
                );

                // Update database
                await prisma.product.update({
                    where: { id: product.id },
                    data: { images: JSON.stringify(updatedUrls) }
                });

                console.log(`   ✅ DB mise à jour pour: ${product.name}`);
            }

        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}`);
        }
    }

    await prisma.$disconnect();
    console.log('\n\n🎉 Correction terminée!');
}

uploadAndFixByName();
