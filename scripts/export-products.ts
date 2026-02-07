
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            stock: true
        },
        orderBy: {
            name: 'asc'
        }
    });

    fs.writeFileSync('temp-products.json', JSON.stringify(products, null, 2));
    console.log(`Exported ${products.length} products to temp-products.json`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
