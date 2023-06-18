/*
  Warnings:

  - You are about to drop the column `group` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `zoomLink` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_mentorId_fkey";

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "group",
DROP COLUMN "zoomLink";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "mentorId",
ADD COLUMN     "groupId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "MentorGroup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentorId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "group" INTEGER NOT NULL,
    "zoomLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_group_key" ON "Group"("group");

-- AddForeignKey
ALTER TABLE "MentorGroup" ADD CONSTRAINT "MentorGroup_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorGroup" ADD CONSTRAINT "MentorGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
