/*
  Warnings:

  - You are about to drop the column `authId` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[internalId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_authId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "authId",
ADD COLUMN     "internalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_internalId_key" ON "Customer"("internalId");
