'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error("Accès refusé : Vous devez être administrateur.");
    }

    // Fetch order with items to manage stock
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
    });

    if (!order) {
        throw new Error("Commande introuvable.");
    }

    const startProcessingStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatus = order.status;

    // Check if we need to decrement stock (moving from PENDING -> PROCESSING+)
    const shouldDecrement = !startProcessingStatuses.includes(currentStatus) && startProcessingStatuses.includes(newStatus);

    // Check if we need to increment stock (moving from PROCESSING+ -> CANCELLED)
    const shouldIncrement = startProcessingStatuses.includes(currentStatus) && newStatus === 'CANCELLED';

    // Check if we are trying to re-cancel (prevent double increment)
    if (currentStatus === 'CANCELLED' && newStatus === 'CANCELLED') {
        return { success: true };
    }

    await prisma.$transaction(async (tx) => {
        // 1. Update Order Status
        await tx.order.update({
            where: { id: orderId },
            data: { status: newStatus as any }
        });

        // 2. Handle Stock Decrement
        if (shouldDecrement) {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
        }

        // 3. Handle Stock Increment (Restock)
        if (shouldIncrement) {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }
        }
    });

    revalidatePath('/profile');
    revalidatePath(`/profile/orders/${orderId}`);
    revalidatePath('/admin/orders');

    return { success: true };
}
