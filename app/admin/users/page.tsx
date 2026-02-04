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

                <div className="bg-white shadow-luxury rounded-sm overflow-hidden border border-beige/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle Actuel</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 md:p-6">
                                                <div className="font-medium text-charcoal text-sm">
                                                    {user.name || 'Sans nom'}
                                                </div>
                                                <div className="text-xs text-gray-400 md:hidden mt-1">{user.email}</div>
                                            </td>
                                            <td className="p-4 md:p-6 text-sm text-gray-600 hidden md:table-cell">
                                                {user.email}
                                            </td>
                                            <td className="p-4 md:p-6 text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="p-4 md:p-6">
                                                <span
                                                    className={`
                                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                                                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-green-100 text-green-800 border border-green-200'}
                                                    `}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 md:p-6 text-right">
                                                <UserRoleToggle
                                                    userId={user.id}
                                                    currentRole={user.role as 'ADMIN' | 'USER'}
                                                    isCurrentUser={user.id === session.user.id}
                                                />
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
