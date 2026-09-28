import { auth } from "../packages/utils/auth";
import { prisma } from "../packages/api-utils/prisma";

async function main() {
  const email = "demo@jobi.fr";
  const password = "Password123!";
  const firstName = "Demo";
  const lastName = "Jobi";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    console.log("Création du compte démo en cours...");
    await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        firstName,
        lastName,
        preferredLocale: "fr",
      },
    });
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
      objectif_quotidien: 10,
    },
  });

  console.log("✅ Compte démo prêt à l'emploi !");
  console.log(`Email : ${email}`);
  console.log(`Mot de passe : ${password}`);
}

main()
  .catch((e) => {
    console.error("Erreur création utilisateur démo :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
