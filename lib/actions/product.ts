'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const slugify = (text: string) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

export async function upsertProduct(data: {
    id?: string;
    name: string;
    description: string;
    price: string | number;
    salePrice?: string | number;
    stock: string | number;
    categoryId: string;
    subcategory?: string;
    isFeatured?: boolean;
    images: string[]; // Changed from single image to array
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "Non autorisé" };
    }

    // Double check admin role
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        return { error: "Accès refusé" };
    }

    const price = parseFloat(data.price.toString());
    const salePrice = data.salePrice ? parseFloat(data.salePrice.toString()) : null;
    const stock = parseInt(data.stock.toString());

    try {
        if (data.id) {
            // Update
            await prisma.product.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    description: data.description,
                    price,
                    salePrice,
                    stock,
                    categoryId: data.categoryId,
                    subcategory: data.subcategory || null,
                    isFeatured: data.isFeatured || false,
                    images: JSON.stringify(data.images), // Serialize array to JSON string
                }
            });
        } else {
            // Create
            let slug = slugify(data.name);
            // Check collision
            let count = 0;
            while (await prisma.product.findUnique({ where: { slug } })) {
                count++;
                slug = `${slugify(data.name)}-${count}`;
            }

            await prisma.product.create({
                data: {
                    name: data.name,
                    slug,
                    description: data.description,
                    price,
                    salePrice,
                    stock,
                    categoryId: data.categoryId,
                    subcategory: data.subcategory || null,
                    isFeatured: data.isFeatured || false,
                    images: JSON.stringify(data.images) // Serialize array to JSON string
                }
            });
        }

        // Aggressive cache invalidation to make product visible immediately
        revalidatePath('/admin/products');
        revalidatePath('/', 'layout');
        revalidatePath('/shop');
        revalidatePath('/shop/[category]', 'page');
        return { success: true };
    } catch (error: any) {
        console.error("Upsert Product Error:", error);
        return { error: error.message || "Erreur lors de l'enregistrement" };
    }
}

export async function deleteProduct(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Non autorisé");
    }

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
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Delete Product Error:", error);
        throw new Error("Erreur lors de la suppression");
    }
}
