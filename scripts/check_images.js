const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
    const products = await prisma.product.findMany({
        where: {
            category: {
                name: {
                    in: ['Face', 'Nails', 'Accessories']
                }
            }
        },
        select: {
            id: true,
            name: true,
            images: true,
            category: {
                select: {
                    name: true
                }
            }
        },
        take: 5
    });

    console.log('===== DIAGNOSTIC DES IMAGES =====\n');
    products.forEach(p => {
        console.log(`Produit: ${p.name}`);
        console.log(`Catégorie: ${p.category.name}`);
        console.log(`Type de images: ${typeof p.images}`);
        console.log(`Est Array: ${Array.isArray(p.images)}`);
        console.log(`Valeur: ${JSON.stringify(p.images)}`);
        console.log('---');
    });

    await prisma.$disconnect();
}

checkImages();
