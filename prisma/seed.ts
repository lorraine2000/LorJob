import { PrismaClient } from '@prisma/client'
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()


async function generateUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  emailVerified: boolean,
  objectif_quotidien: number
): Promise<void> {
	const exists = await prisma.user.findFirst({ where: { email } });
	if (exists) return;

    const id = uuid();

  await prisma.user.create({
    data: {
      id,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: password,
      emailVerified: emailVerified,
      objectif_quotidien: objectif_quotidien
    },
  });
}

async function main() {
  // Exemple de seed
  await generateUser(
    "Lorraine",
    "Admin",
    "contact@lorjob.fr",
    "password123",
    true,
    10
  );
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
