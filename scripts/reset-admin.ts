
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@florelle.com'
    const password = 'admin123'

    console.log(`🔄 Resetting password for ${email}...`)

    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log('✅ Password updated successfully.')
    } else {
        console.log('⚠️ User not found. Creating admin user...')
        await prisma.user.create({
            data: {
                email,
                name: 'Administrateur Florelle',
                password: hashedPassword,
                role: 'ADMIN',
                cin: 'ADMIN001',
                address: 'Siège Florelle',
                city: 'Casablanca',
                phone: '0522000000',
            },
        })
        console.log('✅ Admin user created successfully.')
    }

    console.log(`\n🔑 Verify Login Credentials:`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
