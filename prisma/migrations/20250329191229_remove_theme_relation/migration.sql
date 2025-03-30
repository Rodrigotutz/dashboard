/*
  Warnings:

  - You are about to drop the column `onBackground` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `onError` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `onPrimary` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `onSecondary` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `onSurface` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `surface` on the `themes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "themes" DROP COLUMN "onBackground",
DROP COLUMN "onError",
DROP COLUMN "onPrimary",
DROP COLUMN "onSecondary",
DROP COLUMN "onSurface",
DROP COLUMN "surface";
