/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Commentaire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commentaire" DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "Upvote" (
    "id_upvote" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" TEXT NOT NULL,
    "commentaire_id" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id_upvote")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_utilisateur_id_commentaire_id_key" ON "Upvote"("utilisateur_id", "commentaire_id");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_commentaire_id_fkey" FOREIGN KEY ("commentaire_id") REFERENCES "Commentaire"("id_commentaire") ON DELETE RESTRICT ON UPDATE CASCADE;
