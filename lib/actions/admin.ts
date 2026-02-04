'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Non autorisé");
    }

    // Double check admin role
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        throw new Error("Accès refusé");
    }

    try {
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Delete Product Error:", error);
        throw new Error("Erreur lors de la suppression");
    }
}
