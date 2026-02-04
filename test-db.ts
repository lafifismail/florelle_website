import { prisma } from './lib/prisma'

async function main() {
    // Test the connection
    console.log('🔌 Testing database connection...')

    // Count existing records
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()

    console.log('✅ Database connected successfully!')
    console.log(`📊 Current database stats:`)
    console.log(`   - Users: ${userCount}`)
    console.log(`   - Products: ${productCount}`)
    console.log(`   - Categories: ${categoryCount}`)
}

main()
    .catch((e) => {
        console.error('❌ Error connecting to database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
