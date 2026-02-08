import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import productsData from '../data/products.json'

const prisma = new PrismaClient()

// Type pour les produits du JSON
interface JsonProduct {
    id: string
    slug: string
    name: string
    category: string
    subcategory: string
    description: string
    price: number
    variants: Array<{
        id: string
        name: string
        colorCode?: string
        stock: number
        images: string[]
    }>
    mainImage: string
    features?: string[]
}

async function main() {
    console.log('🌱 Starting database seed with REAL product data...\n')

    // Nettoyer les données existantes
    console.log('🧹 Cleaning existing data...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.address.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Cleanup complete\n')

    // 1️⃣ Créer l'utilisateur administrateur
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@florelle.com',
            name: 'Administrateur Florelle',
            password: hashedPassword,
            role: 'ADMIN',
            cin: 'ADMIN001',
            address: 'Siège Florelle',
            city: 'Casablanca',
            phone: '0522000000',
            isVerified: true, // Admin can login immediately
        },
    })
    console.log(`✅ Admin user created: ${admin.email}`)
    console.log(`   Password: admin123\n`)

    // 2️⃣ Récupérer toutes les catégories uniques du JSON
    const products = productsData as JsonProduct[]
    const categoryMap = new Map<string, string>() // Map de category name -> category slug

    // Extraire les catégories uniques
    const uniqueCategories = [...new Set(products.map(p => p.category))]

    console.log(`📂 Creating ${uniqueCategories.length} categories...`)

    // Créer les catégories
    for (const categoryName of uniqueCategories) {
        // Capitaliser le nom de la catégorie
        const formattedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
        const categorySlug = categoryName.toLowerCase()

        const category = await prisma.category.create({
            data: {
                name: formattedName,
                slug: categorySlug,
                description: `Collection ${formattedName} - Produits professionnels de maquillage`,
                image: `/images/banners/${categorySlug}/${categorySlug}-banner.jpg`,
            },
        })

        categoryMap.set(categoryName, category.id)
        console.log(`   ✅ ${formattedName}`)
    }
    console.log('')

    // 3️⃣ Créer tous les produits
    console.log(`💄 Creating ${products.length} products...`)

    let createdCount = 0
    let skippedCount = 0

    for (const product of products) {
        try {
            // Récupérer le category ID
            const categoryId = categoryMap.get(product.category)
            if (!categoryId) {
                console.log(`   ⚠️  Skipped ${product.name}: Category not found`)
                skippedCount++
                continue
            }

            // Calculer le stock total (somme de tous les variants)
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

            // Utiliser la première variant pour les images
            const firstVariant = product.variants[0]
            const images = firstVariant?.images || [product.mainImage]

            // Marquer les produits populaires comme "featured" (ceux avec beaucoup de stock)
            const isFeatured = totalStock > 60

            // Créer le produit
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    price: product.price,
                    salePrice: null, // Pas de promo par défaut
                    categoryId: categoryId,
                    stock: totalStock,
                    featured: isFeatured,
                    images: JSON.stringify(images),
                    tags: JSON.stringify([product.subcategory, ...(product.features || [])]),
                },
            })

            createdCount++

            // Afficher la progression tous les 10 produits
            if (createdCount % 10 === 0) {
                console.log(`   📦 ${createdCount}/${products.length} products created...`)
            }
        } catch (error) {
            console.error(`   ❌ Error creating ${product.name}:`, error)
            skippedCount++
        }
    }

    console.log(`\n✅ Successfully created ${createdCount} products`)
    if (skippedCount > 0) {
        console.log(`⚠️  Skipped ${skippedCount} products due to errors`)
    }
    console.log('')

    // 4️⃣ Statistiques finales
    const stats = {
        users: await prisma.user.count(),
        categories: await prisma.category.count(),
        products: await prisma.product.count(),
    }

    console.log('📊 Final database statistics:')
    console.log(`   - Users: ${stats.users}`)
    console.log(`   - Categories: ${stats.categories}`)
    console.log(`   - Products: ${stats.products}`)

    // 5️⃣ Afficher quelques exemples de produits créés
    console.log('\n🎨 Sample products:')
    const sampleProducts = await prisma.product.findMany({
        take: 5,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    })

    sampleProducts.forEach(p => {
        console.log(`   - ${p.name} (${p.category.name}) - ${p.price} MAD - Stock: ${p.stock}`)
    })

    console.log('\n✨ Seed completed successfully!')
    console.log('🌐 Open http://localhost:3000 to see your products!')
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
