import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Non autorisé. Veuillez vous connecter.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { currentPassword, newPassword, confirmPassword } = body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Tous les champs sont obligatoires.' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Les nouveaux mots de passe ne correspondent pas.' },
                { status: 400 }
            );
        }

        // Regex for strict password: At least 8 chars, 1 uppercase, 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9]|.*[a-z].*[a-z]).{8,}$/;
        // Adjusted regex simple: At least 8 chars, 1 uppercase, 1 special char
        // Regex explication:
        // (?=.*[A-Z]) -> au moins une majuscule
        // (?=.*[!@#$%^&*(),.?":{}|<>]) -> au moins un caractère spécial
        // .{8,} -> au minimum 8 caractères
        const strictPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!strictPasswordRegex.test(newPassword)) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.' },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, password: true }
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé.' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Le mot de passe actuel est incorrect.' },
                { status: 400 }
            );
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json(
            { message: 'Mot de passe modifié avec succès.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue. Veuillez réessayer.' },
            { status: 500 }
        );
    }
}
