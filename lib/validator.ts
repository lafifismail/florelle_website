import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
        .min(3, { message: "Le nom doit contenir au moins 3 caractères" }),

    email: z.string()
        .email({ message: "Format d'email invalide" }),

    password: z.string()
        .min(8, { message: "8 caractères minimum" })
        .regex(/[A-Z]/, { message: "Au moins une majuscule" })
        .regex(/[a-z]/, { message: "Au moins une minuscule" })
        .regex(/[0-9]/, { message: "Au moins un chiffre" })
        .regex(/[^a-zA-Z0-9]/, { message: "Au moins un caractère spécial" }),

    cin: z.string()
        .regex(/^[A-Za-z]{1,2}\d{1,6}$/, { message: "Format CIN invalide (ex: AB123456)" }),

    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
});
