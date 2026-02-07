const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        include: {
            products: {
                select: {
                    subcategory: true
                }
            }
        }
    });

    console.log('--- Category Summary ---');
    categories.forEach(cat => {
        const subcategories = new Set(cat.products.map(p => p.subcategory).filter(Boolean));
        console.log(`Category: ${cat.name} (${cat.id})`);
        console.log(`  Product count: ${cat.products.length}`);
        console.log(`  Subcategories found: ${Array.from(subcategories).join(', ') || 'NONE'}`);
        console.log('------------------------');
    });

    const featuredCount = await prisma.product.count({ where: { isFeatured: true } });
    console.log(`Total Featured Products: ${featuredCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
