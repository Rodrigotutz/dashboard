/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tips` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tips" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "tips_slug_key" ON "tips"("slug");
