/*
  Warnings:

  - Added the required column `name` to the `Tier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tier"
    ADD COLUMN "name" TEXT NOT NULL;
