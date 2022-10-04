/*
  Warnings:

  - Added the required column `authorId` to the `blog_references` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blog_references" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "blog_references_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "blog_references_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_blog_references" ("blogId", "id", "title", "url") SELECT "blogId", "id", "title", "url" FROM "blog_references";
DROP TABLE "blog_references";
ALTER TABLE "new_blog_references" RENAME TO "blog_references";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
