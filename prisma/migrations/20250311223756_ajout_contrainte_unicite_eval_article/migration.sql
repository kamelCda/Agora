/*
  Warnings:

  - A unique constraint covering the columns `[utilisateur_id,article_id]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nom` on table `Utilisateur` required. This step will fail if there are existing NULL values in that column.
  - Made the column `prenom` on table `Utilisateur` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "valeur" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "nom" SET NOT NULL,
ALTER COLUMN "prenom" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_utilisateur_id_article_id_key" ON "Evaluation"("utilisateur_id", "article_id");
