import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getShopStructure } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://florelle.ma';

    // 1. Pages Statiques
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/livraison',
        '/faq',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Categories (from shop structure)
    const structure = getShopStructure();
    const categories = Object.keys(structure).map((cat) => ({
        url: `${baseUrl}/shop/${cat.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Products (Dynamic from DB)
    // Fetch only slugs and updatedAt to be efficient
    const products = await prisma.product.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7, // Slightly lower than categories
    }));

    return [...staticRoutes, ...categories, ...productRoutes];
}
