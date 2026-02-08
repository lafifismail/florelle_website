const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
    console.log('🔍 Vérification des images dans la DB...\n');

    const products = await prisma.product.findMany({
        select: {
            name: true,
            images: true
        },
        take: 5
    });

    console.log('📦 Premiers 5 produits :\n');

    products.forEach(product => {
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
            console.error(`Erreur parsing ${product.name}:`, e.message);
        }

        const firstImage = imageUrls[0] || 'NONE';
        const isCloudinary = firstImage.includes('cloudinary.com');

        console.log(`${product.name}:`);
        console.log(`  Image: ${firstImage}`);
        console.log(`  Cloudinary: ${isCloudinary ? '✅ OUI' : '❌ NON'}`);
        console.log('');
    });

    await prisma.$disconnect();
}

checkImages();
