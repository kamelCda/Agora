-- DropForeignKey
ALTER TABLE "Categorie" DROP CONSTRAINT "Categorie_utilisateur_id_fkey";

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
