/*
  Warnings:

  - Added the required column `type` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zoomLink` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('SKILL', 'ISSUE');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "type" "ClassType" NOT NULL,
ADD COLUMN     "zoomLink" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
