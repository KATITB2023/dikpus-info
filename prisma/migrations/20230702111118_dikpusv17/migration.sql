-- CreateTable
CREATE TABLE "ShowClue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShowClue_pkey" PRIMARY KEY ("id")
);
