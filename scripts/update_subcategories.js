const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting subcategory update...');

    // Update Face Products
    const faceProducts = await prisma.product.findMany({
        where: { category: { name: 'Face' } }
    });

    for (const product of faceProducts) {
        let sub = 'Foundations'; // Default
        if (product.name.toLowerCase().includes('powder')) sub = 'Powder';
        if (product.name.toLowerCase().includes('blush')) sub = 'Blushes';

        await prisma.product.update({
            where: { id: product.id },
            data: { subcategory: sub }
        });
        console.log(`Updated Face: ${product.name} -> ${sub}`);
    }

    // Update Nails Products
    const nailsProducts = await prisma.product.findMany({
        where: { category: { name: 'Nails' } }
    });

    for (const product of nailsProducts) {
        let sub = 'Nail Polish'; // Default
        if (product.name.toLowerCase().includes('care') || product.name.toLowerCase().includes('treatment')) sub = 'Nail Care';
        if (product.name.toLowerCase().includes('manicure')) sub = 'French Manicure';

        await prisma.product.update({
            where: { id: product.id },
            data: { subcategory: sub }
        });
        console.log(`Updated Nails: ${product.name} -> ${sub}`);
    }

    // Update Accessories Products
    const accProducts = await prisma.product.findMany({
        where: { category: { name: 'Accessories' } }
    });

    for (const product of accProducts) {
        let sub = 'Sharpeners';
        await prisma.product.update({
            where: { id: product.id },
            data: { subcategory: sub }
        });
        console.log(`Updated Accessories: ${product.name} -> ${sub}`);
    }

    console.log('Subcategory update complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
