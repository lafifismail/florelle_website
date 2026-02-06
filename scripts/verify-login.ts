import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyLogin() {
    const email = 'admin@florelle.com';
    const password = 'password123';

    console.log(`🔍 Testing login for: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error('❌ User not found in database!');
            return;
        }

        console.log('✅ User found:', {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            passwordHash: user.password.substring(0, 20) + '...'
        });

        if (!user.isVerified) {
            console.error('❌ User is NOT verified (isVerified = false)');
        } else {
            console.log('✅ User is verified');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            console.log('🎉 SUCCESS: Password is correct!');
        } else {
            console.error('❌ FAILURE: Password does NOT match hash.');
            console.log('Expected content matches hash provided previously?');
        }

    } catch (e) {
        console.error('Error during test:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyLogin();
