import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProduct() {
    const slug = 'waterproof-lip-pencil';
    const product = await prisma.product.findUnique({
        where: { slug },
        select: { id: true, name: true, images: true }
    });

    console.log('Product Info:');
    console.log(JSON.stringify(product, null, 2));

    if (product) {
        console.log('\nImages type:', typeof product.images);
        console.log('Images raw value:', product.images);

        try {
            const parsed = JSON.parse(product.images as string);
            console.log('Parsed images successfully:', parsed);
        } catch (e: any) {
            console.log('Failed to parse images:', e.message);
        }
    }

    await prisma.$disconnect();
}

checkProduct();
