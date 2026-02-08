const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUser() {
    console.log('🔍 Vérification de l\'utilisateur admin...\n');

    const user = await prisma.user.findUnique({
        where: {
            email: 'admin@florelle.com'
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true  // Pour voir si le hash existe
        }
    });

    if (!user) {
        console.log('❌ AUCUN utilisateur admin trouvé!');
        console.log('   Email recherché: admin@florelle.com\n');

        // Compter tous les users
        const userCount = await prisma.user.count();
        console.log(`📊 Total d'utilisateurs dans la DB: ${userCount}\n`);

        if (userCount > 0) {
            console.log('Utilisateurs existants:');
            const allUsers = await prisma.user.findMany({
                select: {
                    email: true,
                    role: true
                }
            });
            allUsers.forEach(u => {
                console.log(`   - ${u.email} (${u.role})`);
            });
        }
    } else {
        console.log('✅ Utilisateur admin trouvé!\n');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nom: ${user.name}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Password hash: ${user.password ? 'OUI (' + user.password.substring(0, 20) + '...)' : 'NON'}\n`);

        console.log('📋 Informations de connexion:');
        console.log('   Email: admin@florelle.com');
        console.log('   Mot de passe: admin123');
    }

    await prisma.$disconnect();
}

checkAdminUser();
