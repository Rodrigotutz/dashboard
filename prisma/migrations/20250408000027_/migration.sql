/*
  Warnings:

  - Made the column `likes` on table `tips` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dislikes` on table `tips` required. This step will fail if there are existing NULL values in that column.
  - Made the column `public` on table `tips` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tips" ALTER COLUMN "slug" DROP DEFAULT,
ALTER COLUMN "likes" SET NOT NULL,
ALTER COLUMN "dislikes" SET NOT NULL,
ALTER COLUMN "public" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
