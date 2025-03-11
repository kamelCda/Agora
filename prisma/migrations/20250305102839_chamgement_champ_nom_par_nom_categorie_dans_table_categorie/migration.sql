/*
  Warnings:

  - You are about to drop the column `nom` on the `Categorie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nomCategorie]` on the table `Categorie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomCategorie` to the `Categorie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Categorie_nom_key";

-- AlterTable
ALTER TABLE "Categorie" DROP COLUMN "nom",
ADD COLUMN     "nomCategorie" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categorie_nomCategorie_key" ON "Categorie"("nomCategorie");
