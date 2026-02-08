const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
    const categories = await prisma.category.findMany({
        select: {
            name: true,
            slug: true
        }
    });

    console.log('===== CATÉGORIES DANS LA DB =====\n');
    categories.forEach(cat => {
        console.log(`Name: "${cat.name}" | Slug: "${cat.slug}"`);
    });

    await prisma.$disconnect();
}

checkCategories();
