'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/mail';
import { redirect } from 'next/navigation';
import { registerSchema } from '@/lib/validator';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cin = (formData.get('cin') as string) || ''; // Use empty string for optional fields to pass schema if needed, or handle in schema
    const phone = (formData.get('phone') as string) || undefined;
    const address = (formData.get('address') as string) || undefined;
    const city = (formData.get('city') as string) || undefined;

    // Validate with Zod
    const validationResult = registerSchema.safeParse({
        name, email, password, cin, phone, address, city
    });

    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message };
    }

    // Check existing
    const whereConditions: any[] = [{ email }];
    if (cin) whereConditions.push({ cin });

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: whereConditions
        }
    });

    if (existingUser) {
        return { error: 'Cet email ou CIN est déjà utilisé.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Verification Code (6 digits)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cin,
                phone,
                address,
                city,
                verificationCode: code,
                verificationCodeExpires: expiresAt,
                isVerified: false
            }
        });

        // Send Email
        await sendVerificationEmail(email, code);

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Une erreur est survenue lors de la création du compte.' };
    }

    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function verifyUser(email: string, code: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return { error: 'Utilisateur non trouvé.' };
    }

    if (user.isVerified) {
        return { success: true }; // Already verified
    }

    if (user.verificationCode !== code) {
        return { error: 'Code incorrect.' };
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
        return { error: 'Le code a expiré.' };
    }

    // Update User
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null
        }
    });

    return { success: true };
}
