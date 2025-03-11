/*
  Warnings:

  - You are about to drop the column `publier` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "publier",
ALTER COLUMN "miseAjourLe" DROP NOT NULL;
