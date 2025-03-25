import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["UTILISATEUR", "MODERATEUR", "ADMINISTRATEUR"];
  for (const roleNom of roles) {
    await prisma.role.upsert({
      where: { nomRole: roleNom },
      update: {},
      create: { nomRole: roleNom },
    });
  }

  console.log("Rôles ajoutés !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
