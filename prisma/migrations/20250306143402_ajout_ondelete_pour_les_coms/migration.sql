-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_categorie_id_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_article_id_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_article_id_fkey";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "Categorie"("id_categorie") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;
