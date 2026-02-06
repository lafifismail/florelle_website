import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@florelle.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`🔄 Resetting admin account for: ${email}`);

    try {
        // 1. Delete if exists
        const deleted = await prisma.user.deleteMany({
            where: { email }
        });
        if (deleted.count > 0) {
            console.log('🗑️  Existing admin user deleted.');
        }

        // 2. Create new admin
        const user = await prisma.user.create({
            data: {
                email,
                name: 'Administrateur Florelle',
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true,
                address: 'Siège Florelle',
                city: 'Casablanca',
                phone: '0522000000',
            }
        });

        console.log('✅ New Admin Created Successfully!');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${user.email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`🛡️  Role:     ${user.role}`);
        console.log(`✅ Verified: ${user.isVerified}`);
        console.log('-----------------------------------');
        console.log('👉 Try logging in now via the website.');

    } catch (e) {
        console.error('❌ Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
