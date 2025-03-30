-- AlterTable
ALTER TABLE "users" ADD COLUMN     "themeId" INTEGER;

-- CreateTable
CREATE TABLE "themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "primary" TEXT NOT NULL DEFAULT 'blue-600',
    "secondary" TEXT NOT NULL DEFAULT 'purple-500',
    "background" TEXT NOT NULL DEFAULT 'white',
    "surface" TEXT NOT NULL DEFAULT 'gray-50',
    "error" TEXT NOT NULL DEFAULT 'red-500',
    "onPrimary" TEXT NOT NULL DEFAULT 'white',
    "onSecondary" TEXT NOT NULL DEFAULT 'white',
    "onBackground" TEXT NOT NULL DEFAULT 'gray-900',
    "onSurface" TEXT NOT NULL DEFAULT 'gray-900',
    "onError" TEXT NOT NULL DEFAULT 'white',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,
    "content" TEXT NOT NULL,
    "public" BOOLEAN DEFAULT false,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
