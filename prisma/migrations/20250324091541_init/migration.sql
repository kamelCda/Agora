-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "adresse" TEXT,
    "telephone" VARCHAR(14),
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "ville" TEXT,
    "image" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "miseAjourLe" TIMESTAMP(3),
    "nomUtilisateur" TEXT,
    "banni" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "roleId_role" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Role" (
    "id_role" TEXT NOT NULL,
    "nomRole" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id_categorie" TEXT NOT NULL,
    "nomCategorie" TEXT NOT NULL,
    "utilisateur_id" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id_categorie")
);

-- CreateTable
CREATE TABLE "Article" (
    "id_article" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "miseAjourLe" TIMESTAMP(3),
    "utilisateur_id" TEXT NOT NULL,
    "categorie_id" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id_article")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "id_commentaire" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "miseAjourLe" TIMESTAMP(3) NOT NULL,
    "utilisateur_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id_commentaire")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id_evaluation" TEXT NOT NULL,
    "valeur" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id_evaluation")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id_notification" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lire" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "ReseauSocial" (
    "id_reseauSocial" TEXT NOT NULL,
    "plateforme" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ReseauSocial_pkey" PRIMARY KEY ("id_reseauSocial")
);

-- CreateTable
CREATE TABLE "AbonnementReseauSocial" (
    "id_utilisateur" TEXT NOT NULL,
    "id_reseauSocial" TEXT NOT NULL,

    CONSTRAINT "AbonnementReseauSocial_pkey" PRIMARY KEY ("id_utilisateur","id_reseauSocial")
);

-- CreateTable
CREATE TABLE "AffectationRole" (
    "id_utilisateur" TEXT NOT NULL,
    "id_role" TEXT NOT NULL,

    CONSTRAINT "AffectationRole_pkey" PRIMARY KEY ("id_utilisateur","id_role")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id_upvote" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" TEXT NOT NULL,
    "commentaire_id" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id_upvote")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_nomUtilisateur_key" ON "Utilisateur"("nomUtilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Role_nomRole_key" ON "Role"("nomRole");

-- CreateIndex
CREATE UNIQUE INDEX "Categorie_nomCategorie_key" ON "Categorie"("nomCategorie");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_utilisateur_id_article_id_key" ON "Evaluation"("utilisateur_id", "article_id");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_utilisateur_id_commentaire_id_key" ON "Upvote"("utilisateur_id", "commentaire_id");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_roleId_role_fkey" FOREIGN KEY ("roleId_role") REFERENCES "Role"("id_role") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "Categorie"("id_categorie") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;

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
