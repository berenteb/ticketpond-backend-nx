/*
  Warnings:

  - You are about to drop the column `internalId` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - The required column `authId` was added to the `Customer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Customer_internalId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "internalId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_authId_key" ON "Customer"("authId");
