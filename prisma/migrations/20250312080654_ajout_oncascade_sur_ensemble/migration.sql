-- DropForeignKey
ALTER TABLE "AbonnementReseauSocial" DROP CONSTRAINT "AbonnementReseauSocial_id_reseauSocial_fkey";

-- DropForeignKey
ALTER TABLE "AbonnementReseauSocial" DROP CONSTRAINT "AbonnementReseauSocial_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "AffectationRole" DROP CONSTRAINT "AffectationRole_id_role_fkey";

-- DropForeignKey
ALTER TABLE "AffectationRole" DROP CONSTRAINT "AffectationRole_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_commentaire_id_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_utilisateur_id_fkey";

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbonnementReseauSocial" ADD CONSTRAINT "AbonnementReseauSocial_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbonnementReseauSocial" ADD CONSTRAINT "AbonnementReseauSocial_id_reseauSocial_fkey" FOREIGN KEY ("id_reseauSocial") REFERENCES "ReseauSocial"("id_reseauSocial") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectationRole" ADD CONSTRAINT "AffectationRole_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectationRole" ADD CONSTRAINT "AffectationRole_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "Role"("id_role") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_commentaire_id_fkey" FOREIGN KEY ("commentaire_id") REFERENCES "Commentaire"("id_commentaire") ON DELETE CASCADE ON UPDATE CASCADE;
