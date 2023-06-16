/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Assignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AssignmentSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AssignmentSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AttendanceReason` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AttendanceReason` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Example` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Example` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Mentor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Mentor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `studentId` on the `AssignmentSubmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assignmentId` on the `AssignmentSubmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `studentId` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `attendanceId` on the `AttendanceReason` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Mentor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mentorId` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceReason" DROP CONSTRAINT "AttendanceReason_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "studentId",
ADD COLUMN     "studentId" UUID NOT NULL,
DROP COLUMN "assignmentId",
ADD COLUMN     "assignmentId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "studentId",
ADD COLUMN     "studentId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AttendanceReason" DROP CONSTRAINT "AttendanceReason_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "attendanceId",
ADD COLUMN     "attendanceId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "AttendanceReason_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Example" DROP CONSTRAINT "Example_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Example_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "mentorId",
ADD COLUMN     "mentorId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceReason_attendanceId_key" ON "AttendanceReason"("attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_userId_key" ON "Mentor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceReason" ADD CONSTRAINT "AttendanceReason_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
