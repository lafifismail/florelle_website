
import { PrismaClient } from '@prisma/client';

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

    console.log("Current Products in DB:");
    products.forEach(p => {
        console.log(`- [${p.id}] "${p.name}" (Slug: ${p.slug}) - Price: ${p.price} - Stock: ${p.stock}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
