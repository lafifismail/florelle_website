import { ReactNode } from 'react';

export default async function CategoryLayout({
    children,
}: {
    children: ReactNode;
    params: Promise<{ category: string }>;
}) {
    // This layout just passes through to children
    // Category page and subcategory pages handle their own layouts
    return <>{children}</>;
}
