'use client';

import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/product";
import { useTransition } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            startTransition(async () => {
                await deleteProduct(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
            title="Supprimer le produit"
        >
            {isPending ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Trash2 size={18} />
            )}
        </button>
    );
}
