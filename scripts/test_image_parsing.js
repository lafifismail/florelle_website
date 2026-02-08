const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testImageParsing() {
    console.log('===== TEST DE PARSING D\'IMAGES =====\\n');

    // Récupérer quelques produits
    const products = await prisma.product.findMany({
        where: {
            category: {
                name: 'Face'
            }
        },
        select: {
            id: true,
            name: true,
            images: true
        },
        take: 3
    });

    console.log(`Trouvé ${products.length} produits Face:\n`);

    products.forEach(p => {
        console.log(`Produit: ${p.name}`);
        console.log(`  Type de images: ${typeof p.images}`);
        console.log(`  Est Array: ${Array.isArray(p.images)}`);
        console.log(`  Valeur brute: ${JSON.stringify(p.images)}`);

        // Tester le parsing comme dans DBProductCard
        let imageUrls = [];
        try {
            if (Array.isArray(p.images)) {
                imageUrls = p.images;
                console.log(`  ✅ C'est déjà un array`);
            } else if (typeof p.images === 'string') {
                const parsed = JSON.parse(p.images);
                if (Array.isArray(parsed)) {
                    imageUrls = parsed;
                    console.log(`  ✅ Parsing réussi`);
                } else {
                    console.log(`  ❌ Le parsing a donné un non-array`);
                }
            } else {
                console.log(`  ❌ Type non géré: ${typeof p.images}`);
            }
        } catch (error) {
            console.log(`  ❌ Erreur de parsing: ${error.message}`);
        }

        console.log(`  Résultat parsé: ${JSON.stringify(imageUrls)}`);
        console.log(`  Nombre d'images: ${imageUrls.length}`);
        if (imageUrls.length > 0) {
            console.log(`  Première image: ${imageUrls[0]}`);
        }
        console.log('---\n');
    });

    await prisma.$disconnect();
}

testImageParsing();
