const fs = require('fs');
const path = require('path');
const productsData = require('../data/products.json');

console.log('🔍 Vérification des images manquantes...\n');

let totalImages = 0;
let missingImages = 0;
let foundImages = 0;

// Grouper par catégorie
const categoriesWithMissing = {};

productsData.forEach(product => {
    const variant = product.variants[0];
    const images = variant?.images || [product.mainImage];

    images.forEach(imagePath => {
        totalImages++;
        const fullPath = path.join(__dirname, '..', 'public', imagePath);

        if (fs.existsSync(fullPath)) {
            foundImages++;
        } else {
            missingImages++;

            // Grouper les manquantes par catégorie
            if (!categoriesWithMissing[product.category]) {
                categoriesWithMissing[product.category] = [];
            }
            categoriesWithMissing[product.category].push({
                product: product.name,
                image: imagePath
            });
        }
    });
});

console.log('📊 Résumé:');
console.log(`   Total d'images référencées: ${totalImages}`);
console.log(`   ✅ Images trouvées: ${foundImages}`);
console.log(`   ❌ Images manquantes: ${missingImages}\n`);

if (missingImages > 0) {
    console.log('📋 Détail par catégorie:');
    Object.keys(categoriesWithMissing).forEach(category => {
        console.log(`\n   ${category.toUpperCase()}:`);
        categoriesWithMissing[category].forEach(item => {
            console.log(`      - ${item.product}`);
            console.log(`        ${item.image}`);
        });
    });
} else {
    console.log('✅ Toutes les images existent!');
}
