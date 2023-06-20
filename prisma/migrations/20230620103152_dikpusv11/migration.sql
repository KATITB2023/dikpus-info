-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "materialPath" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EmbedYoutube" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "liveLink" VARCHAR(255) NOT NULL,
    "fallbackLink" VARCHAR(255) NOT NULL,

    CONSTRAINT "EmbedYoutube_pkey" PRIMARY KEY ("id")
);
