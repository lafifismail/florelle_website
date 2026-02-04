'use server'

import { prisma } from './prisma'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get all products from database with their categories
 */
export async function getProductsFromDB() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return products
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

/**
 * Get featured products only (for homepage "Incontournables")
 */
export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 8, // Limit to 8 featured products
        })
        return products
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

/**
 * Get products by category name
 */
export async function getProductsByCategory(categoryName: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    name: categoryName,
                },
            },
            include: {
                category: true,
            },
        })
        return products
    } catch (error) {
        console.error('Error fetching products by category:', error)
        return []
    }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: slug,
            },
            include: {
                category: true,
            },
        })
        return product
    } catch (error) {
        console.error('Error fetching product by slug:', error)
        return null
    }
}

/**
 * Get all categories
 */
export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

/**
 * Create a new order (Protected)
 */
export async function createOrder(data: {
    items: { productId: string; quantity: number }[],
    shippingDetails: any
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Vous devez être connecté pour commander");
    }

    const { items, shippingDetails } = data;

    // 1. Get User
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    // 2. Calculate Total Server-Side (Anti-Fraud)
    let calculatedTotal = 0;

    // Fetch all products involved
    const productIds = items.map(item => item.productId);
    const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    const orderItemsData = [];

    for (const item of items) {
        const product = dbProducts.find(p => p.id === item.productId);
        if (!product) continue;

        const price = product.salePrice || product.price;
        calculatedTotal += price * item.quantity;

        orderItemsData.push({
            productId: product.id,
            quantity: item.quantity,
            price: price
        });
    }

    // Shipping Logic (Zone-based)
    // Import dynamically or assume it's available. To avoid circular deps or complex imports in server actions if any, we'll implement logic here or import the utility.
    // Ideally we import the utility we just created.

    const { calculateShippingFee } = await import('./shipping');
    const city = shippingDetails.city;
    const shippingCost = calculateShippingFee(city, calculatedTotal);

    // Legacy support: if shippingCost logic fails for some reason, default to safe fallback? 
    // No, strictly follow business rules.

    const finalTotal = calculatedTotal + shippingCost;

    // 3. Create Order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: finalTotal,
            shippingFee: shippingCost, // Save the fee!
            status: 'PENDING',
            shippingAddress: JSON.stringify(shippingDetails),
            billingAddress: JSON.stringify(shippingDetails), // Same for COD
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            items: {
                create: orderItemsData
            }
        }
    });

    // --- Send Email Simulation ---
    try {
        const { OrderConfirmationEmail } = await import('./mail-templates/OrderConfirmation');
        const emailData = OrderConfirmationEmail(
            order.id,
            user.name || "Client",
            orderItemsData.map(item => {
                const product = dbProducts.find(p => p.id === item.productId);
                return { name: product?.name || "Produit", quantity: item.quantity, price: item.price };
            }),
            finalTotal,
            shippingCost // Pass shipping cost to email template
        );

        console.log("\n=================================================================================");
        console.log("                           SIMULATION EMAIL CONFIRMATION                           ");
        console.log("=================================================================================\n");
        console.log(`TO: ${user.email}`);
        console.log(`SUBJECT: ${emailData.subject}`);
        console.log("\n--- HTML CONTENT (Preview) ---\n");
        console.log(emailData.html);
        console.log("\n=================================================================================\n");
    } catch (e) {
        console.error("Failed to simulate email:", e);
    }
    // ----------------------------

    return { success: true, orderId: order.id };
}

/**
 * Update user profile (Protected)
 */
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    name: string;
    phone: string;
    city: string;
    cin: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Vous devez être connecté");
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: data.name,
                phone: data.phone,
                city: data.city,
                cin: data.cin
            } as any
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error("Update Profile Error:", error);
        throw new Error("Erreur lors de la mise à jour du profil");
    }
}
