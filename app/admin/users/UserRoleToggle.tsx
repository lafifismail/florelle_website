'use client';

import { useState } from "react";
import { toggleUserRole } from "@/lib/actions/users";
import { useRouter } from "next/navigation";

interface UserRoleToggleProps {
    userId: string;
    currentRole: 'ADMIN' | 'USER';
    isCurrentUser: boolean;
}

export const UserRoleToggle = ({ userId, currentRole, isCurrentUser }: UserRoleToggleProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (isCurrentUser) return;

        const confirmMessage = currentRole === 'ADMIN'
            ? "Êtes-vous sûr de vouloir retirer les droits d'administration à cet utilisateur ?"
            : "Voulez-vous vraiment promouvoir cet utilisateur Administrateur ?";

        if (!window.confirm(confirmMessage)) return;

        setIsLoading(true);
        try {
            await toggleUserRole(userId);
            router.refresh();
        } catch (error) {
            alert("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCurrentUser) {
        return (
            <span className="text-xs text-gray-400 italic px-3 py-1 border border-transparent">
                Vous
            </span>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading || isCurrentUser}
            className={`
                text-xs font-bold px-3 py-1 rounded-sm border transition-colors
                ${currentRole === 'ADMIN'
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-gold text-gold hover:bg-gold hover:text-white'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {isLoading ? '...' : (currentRole === 'ADMIN' ? 'Rétrograder' : 'Promouvoir')}
        </button>
    );
};
