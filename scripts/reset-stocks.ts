
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting all product stocks to 10...');

    const result = await prisma.product.updateMany({
        data: {
            stock: 10
        }
    });

    console.log(`Updated stock for ${result.count} products.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
