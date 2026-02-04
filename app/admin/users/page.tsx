import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from '@/components/layout/Navbar';
import { UserRoleToggle } from './UserRoleToggle';
import { UserSearch } from './UserSearch';

import { RoleFilter } from "@/components/admin/RoleFilter";

interface AdminUsersPageProps {
    searchParams: Promise<{
        search?: string;
        role?: string; // Add role to props
    }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.search || '';
    const roleParam = resolvedSearchParams.role;

    // Build Where Clause
    const where: any = {
        OR: [
            { name: { contains: query } },
            { email: { contains: query } }
        ]
    };

    // Add Role Filter
    if (roleParam === 'ADMIN' || roleParam === 'USER') {
        where.role = roleParam;
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: {
            createdAt: 'desc',
        },
        take: 50, // Limit results for performance
    });

    return (
        <div className="min-h-screen bg-off-white">
            <Navbar />

            <main className="pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal mb-2">Gestion des Utilisateurs</h1>
                        <p className="text-gray-500">Gérez les rôles et accès de votre équipe.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <UserSearch />
                        <RoleFilter />
                    </div>
                </div>

                <div className="bg-white border border-beige/20 rounded-sm shadow-sm overflow-hidden">

                    {/* ✅ 1. AJOUT DU WRAPPER DE SCROLL */}
                    <div className="overflow-x-auto">

                        {/* ✅ 2. AJOUT DE min-w-[1000px] pour empêcher l'écrasement */}
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
                                        <td colSpan={4} className="p-8 text-center text-charcoal/40 italic">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-off-white/50 transition-colors">
                                            <td className="p-4 font-medium text-charcoal whitespace-nowrap">
                                                {/* whitespace-nowrap empêche le nom de se casser sur 2 lignes */}
                                                {user.name || "Sans nom"}
                                            </td>
                                            <td className="p-4 text-charcoal/80">
                                                {user.email}
                                            </td>
                                            <td className="p-4 text-center">
                                                <UserRoleToggle
                                                    userId={user.id}
                                                    currentRole={user.role as 'ADMIN' | 'USER'}
                                                    isCurrentUser={user.id === session.user.id}
                                                />
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

            </main>
        </div>
    );
}
