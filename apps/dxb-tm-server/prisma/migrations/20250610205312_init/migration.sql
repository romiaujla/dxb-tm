/*
  Warnings:

  - You are about to drop the column `name` on the `instance` table. All the data in the column will be lost.
  - Added the required column `nam` to the `instance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instance" DROP COLUMN "name",
ADD COLUMN     "nam" TEXT NOT NULL;
