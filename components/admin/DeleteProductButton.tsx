'use client';

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

export const DeleteProductButton = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

        setLoading(true);
        try {
            await deleteProduct(id);
            // Router refresh is handled server-side by revalidatePath usually, 
            // but router.refresh ensures client cache is updated if needed.
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Supprimer"
        >
            <Trash2 size={18} />
        </button>
    );
};
