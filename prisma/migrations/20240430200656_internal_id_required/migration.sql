/*
  Warnings:

  - Made the column `internalId` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "internalId" SET NOT NULL;
