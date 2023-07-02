-- CreateTable
CREATE TABLE "Clue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "divisi" VARCHAR(255) NOT NULL,
    "clue" TEXT NOT NULL,
    "link" VARCHAR(255) NOT NULL,

    CONSTRAINT "Clue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acceptance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "clueId" UUID NOT NULL,

    CONSTRAINT "Acceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acceptance_studentId_key" ON "Acceptance"("studentId");

-- AddForeignKey
ALTER TABLE "Acceptance" ADD CONSTRAINT "Acceptance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acceptance" ADD CONSTRAINT "Acceptance_clueId_fkey" FOREIGN KEY ("clueId") REFERENCES "Clue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
