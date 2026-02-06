import { requireAdmin } from "@/lib/adminAuth";
import AdminSidebarClient from "@/components/admin/AdminSidebarClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return <AdminSidebarClient>{children}</AdminSidebarClient>;
}

