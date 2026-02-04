'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserRole(userId: string) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error("Accès refusé : Vous devez être administrateur.");
    }

    if (session.user.id === userId) {
        throw new Error("Action impossible : Vous ne pouvez pas modifier votre propre rôle.");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error("Utilisateur non trouvé.");
    }

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });

    revalidatePath('/admin/users');
    return { success: true, newRole };
}
