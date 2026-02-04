import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Updating product descriptions from products.json...')

    const jsonPath = path.join(process.cwd(), 'data/products.json')
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

    const productsToUpdate = [
        // ACCESSORIES
        "Sharpener Duo"
    ];

    let updatedCount = 0;

    for (const productName of productsToUpdate) {
        const jsonProduct = productsData.find((p: any) => p.name === productName);

        if (jsonProduct) {
            try {
                // Find product by name (since slug might be slightly different or just to be safe)
                // But better to use slug if possible. Let's stick to name as it is unique in our seed.
                const product = await prisma.product.findFirst({
                    where: { name: productName }
                });

                if (product) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { description: jsonProduct.description }
                    });
                    console.log(`✅ Updated: ${productName}`);
                    updatedCount++;
                } else {
                    console.log(`⚠️  Product not found in DB: ${productName}`);
                }
            } catch (error) {
                console.error(`❌ Error updating ${productName}:`, error);
            }
        } else {
            console.log(`⚠️  Product not found in JSON: ${productName}`);
        }
    }

    console.log(`\n✨ Update complete! ${updatedCount} descriptions updated.`);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
