/*
  Warnings:

  - You are about to drop the column `role_id` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_role_id_fkey";

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "role_id",
ADD COLUMN     "roleId_role" TEXT;

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_roleId_role_fkey" FOREIGN KEY ("roleId_role") REFERENCES "Role"("id_role") ON DELETE SET NULL ON UPDATE CASCADE;
