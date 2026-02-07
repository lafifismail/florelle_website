
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'minasaadaoui@florelle.ma';
    const password = 'minasaadaoui123';

    console.log(`🔍 DIAGNOSTIC (Tentative 2) pour : ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ Utilisateur introuvable.');
        return;
    }

    console.log(`✅ Utilisateur trouvé (Statut actuel: isVerified = ${user.isVerified})`);

    if (!user.isVerified) {
        console.log('⚡ Activation du compte en cours...');

        // Correction: On met juste isVerified à true. Pas de champ "emailVerified" dans votre schema.
        await prisma.user.update({
            where: { email },
            data: { isVerified: true }
        });
        console.log('✅ Compte ACTIVÉ avec succès !');
    } else {
        console.log('ℹ️ Le compte était déjà actif.');
    }

    // Double check password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        console.log('✅ Mot de passe VALIDE. Vous devriez pouvoir vous connecter.');
    } else {
        console.error('❌ Mot de passe INVALIDE.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
