'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported here
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        throw new Error("Vous devez être connecté pour laisser un avis.");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        throw new Error("Utilisateur introuvable.");
    }

    await prisma.review.create({
        data: {
            rating,
            comment,
            userId: user.id,
            productId,
            isApproved: false // Default to false for moderation
        }
    });

    revalidatePath(`/shop`); // Ideally more specific, but this works
    return { success: true, message: "Avis envoyé ! Il sera visible après modération." };
}

export async function getProductReviews(productId: string) {
    const reviews = await prisma.review.findMany({
        where: {
            productId,
            isApproved: true
        },
        include: {
            user: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return reviews;
}

export async function getReviewStats(productId: string) {
    const aggregations = await prisma.review.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true }
    });

    return {
        average: aggregations._avg.rating || 0,
        count: aggregations._count.rating || 0
    };
}

// Admin Actions
export async function getAdminReviews() {
    const session = await getServerSession(authOptions);
    // Add admin check here if not handled by middleware/page

    return await prisma.review.findMany({
        include: {
            user: { select: { name: true, email: true } },
            product: { select: { name: true, images: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function toggleReviewStatus(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error("Avis introuvable");

    await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: !review.isApproved }
    });

    revalidatePath('/admin/reviews');
    revalidatePath('/shop');
}

export async function deleteReview(reviewId: string) {
    await prisma.review.delete({ where: { id: reviewId } });
    revalidatePath('/admin/reviews');
    revalidatePath('/shop');
}
