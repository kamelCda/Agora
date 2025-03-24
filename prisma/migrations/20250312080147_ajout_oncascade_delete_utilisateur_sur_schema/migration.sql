-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_role_id_fkey";

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id_role") ON DELETE CASCADE ON UPDATE CASCADE;
