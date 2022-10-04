/*
  Warnings:

  - You are about to drop the column `authorId` on the `blog_references` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `userId` to the `blog_references` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blog_references" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "blog_references_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "blog_references_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_blog_references" ("blogId", "id", "title", "url") SELECT "blogId", "id", "title", "url" FROM "blog_references";
DROP TABLE "blog_references";
ALTER TABLE "new_blog_references" RENAME TO "blog_references";
CREATE TABLE "new_blogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_blogs" ("body", "category", "createdAt", "id", "readCount", "title", "updatedAt") SELECT "body", "category", "createdAt", "id", "readCount", "title", "updatedAt" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
