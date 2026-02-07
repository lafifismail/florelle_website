
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'minasaadaoui@florelle.ma';
    const password = 'minasaadaoui123';

    console.log(`🔍 Diagnostic de connexion pour : ${email}`);

    // 1. Recherche Utilisateur
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ ÉCHEC : Utilisateur introuvable dans la DB.');
        return;
    }
    console.log('✅ Utilisateur trouvé.');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Verified: ${user.isVerified}`); // CRITICAL CHECK

    // 2. Vérification du statut 'isVerified'
    if (!user.isVerified) {
        console.error('❌ ÉCHEC : Le compte n\'est pas vérifié (isVerified = false).');
        console.log('   💡 SOLUTION : Je vais activer le compte maintenant...');

        // Auto-fix
        await prisma.user.update({
            where: { email },
            data: { isVerified: true, emailVerified: new Date() }
        });
        console.log('   ✅ Compte activé ! Réessayez de vous connecter.');
        return;
    }

    // 3. Comparaison Mot de Passe
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        console.log('✅ SUCCÈS : Le mot de passe est CORRECT.');
        console.log('   Si la connexion échoue sur le site, vérifiez les cookies ou le cache.');
    } else {
        console.error('❌ ÉCHEC : Le mot de passe ne correspond pas au hash en base.');
        console.log('   - Mot de passe testé :', password);
        console.log('   - Hash en base :', user.password);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
