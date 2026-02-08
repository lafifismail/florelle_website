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

// The 4 problematic products
const problematicPaths = [
    '/images/products/eyes/mascara/lash-&-brow-mascara-gel.jpg',
    '/images/products/eyes/eyeliners/ultra-black-eyeliner-&-khol-waterproof.jpg',
    '/images/products/eyes/eyeshadows/wet-&-dry-eyeshadow.jpg',
    '/images/products/face/blushes/wet-&-dry-blush.jpeg'
];

async function uploadAndFix() {
    console.log('🔧 Correction des 4 produits problématiques...\n');

    for (const webPath of problematicPaths) {
        // Convert web path to local file path
        const localPath = path.join(IMAGES_DIR, webPath.replace(/\//g, path.sep));

        console.log(`📤 Uploading: ${webPath}`);

        // Check if file exists
        if (!fs.existsSync(localPath)) {
            console.log(`   ❌ Fichier introuvable: ${localPath}\n`);
            continue;
        }

        try {
            // Generate public_id - replace & with 'and' for Cloudinary compatibility
            const relativePath = webPath.replace('/images/products/', '');
            const cleanPath = relativePath
                .replace(/&/g, 'and')  // Replace & with 'and'
                .replace(/\s+/g, '-');  // Replace spaces with dashes
            const publicId = 'florelle/products/' + cleanPath.replace(/\.(jpg|jpeg|png)$/i, '');

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(localPath, {
                public_id: publicId,
                folder: 'florelle/products',
                resource_type: 'image',
                overwrite: true
            });

            console.log(`   ✅ Uploaded: ${result.secure_url}`);

            // Update database: find products with this image path
            const products = await prisma.product.findMany({
                where: {
                    images: {
                        contains: webPath
                    }
                }
            });

            console.log(`   📦 Found ${products.length} product(s) to update`);

            for (const product of products) {
                let imageUrls = [];
                if (typeof product.images === 'string') {
                    imageUrls = JSON.parse(product.images);
                } else if (Array.isArray(product.images)) {
                    imageUrls = product.images;
                }

                // Replace local path with Cloudinary URL
                const updatedUrls = imageUrls.map(url =>
                    url === webPath ? result.secure_url : url
                );

                await prisma.product.update({
                    where: { id: product.id },
                    data: { images: JSON.stringify(updatedUrls) }
                });

                console.log(`   ✅ Updated: ${product.name}`);
            }

            console.log('');

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}\n`);
        }
    }

    await prisma.$disconnect();
    console.log('🎉 Correction terminée!');
}

uploadAndFix();
