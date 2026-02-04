import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { UserRoleToggle } from "./UserRoleToggle";
import SearchInput from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);
    await requireAdmin();

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const search = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : '';
    const role = typeof resolvedSearchParams.role === 'string' ? resolvedSearchParams.role : '';

    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
        ];
    }

    if (role && role !== 'all') {
        where.role = role; // 'ADMIN' ou 'USER'
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-8 animate-in fade-in">

            {/* --- HEADER STYLE MOBILE (3 ÉTAGES) --- */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-sm shadow-sm border border-beige/20">

                {/* ÉTAGE 1 : Titre */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h1 className="font-serif text-3xl text-charcoal">Clients</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-gold">{total}</span> utilisateurs inscrits
                        </p>
                    </div>
                </div>

                {/* ÉTAGE 2 : Recherche (Pleine Largeur) */}
                <div className="w-full">
                    <SearchInput placeholder="Rechercher (Nom, Email)..." />
                </div>

                {/* ÉTAGE 3 : Filtres (Rôle) */}
                {/* Simple filtre par lien si le composant RoleFilter n'existe pas */}
                <div className="flex flex-col sm:flex-row justify-start items-center gap-4 border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                        <a href="/admin/users" className={`px-4 py-2 rounded text-xs font-medium border ${!role ? 'bg-charcoal text-white' : 'bg-white'}`}>Tout</a>
                        <a href="/admin/users?role=ADMIN" className={`px-4 py-2 rounded text-xs font-medium border ${role === 'ADMIN' ? 'bg-charcoal text-white' : 'bg-white'}`}>Admins</a>
                        <a href="/admin/users?role=USER" className={`px-4 py-2 rounded text-xs font-medium border ${role === 'USER' ? 'bg-charcoal text-white' : 'bg-white'}`}>Clients</a>
                    </div>
                </div>
            </div>

            {/* --- TABLEAU UTILISATEURS (SCROLLABLE) --- */}
            <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[1000px]">
                        <thead className="bg-off-white border-b border-beige/20 text-charcoal/60 uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="p-4 font-normal">Utilisateur</th>
                                <th className="p-4 font-normal">Email</th>
                                <th className="p-4 font-normal text-center">Rôle</th>
                                <th className="p-4 font-normal">Date d'inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige/10">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-off-white/50 transition-colors">
                                        <td className="p-4 font-medium text-charcoal whitespace-nowrap">
                                            {user.name || "Sans nom"}
                                        </td>
                                        <td className="p-4 text-charcoal/80">
                                            {user.email}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                <UserRoleToggle
                                                    userId={user.id}
                                                    currentRole={user.role as 'ADMIN' | 'USER'}
                                                    isCurrentUser={user.id === session?.user?.id}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-charcoal/60 whitespace-nowrap">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
