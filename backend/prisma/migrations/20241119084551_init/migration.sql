-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'MESSAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('FRIEND', 'TASK');

-- CreateTable
CREATE TABLE "User"
(
    "id"    SERIAL NOT NULL,
    "email" TEXT   NOT NULL,
    "name"  TEXT   NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target"
(
    "id"     SERIAL       NOT NULL,
    "name"   TEXT         NOT NULL,
    "notes"  TEXT         NOT NULL,
    "type"   "TargetType" NOT NULL,
    "userId" INTEGER      NOT NULL,
    "tierId" INTEGER      NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier"
(
    "id"       SERIAL  NOT NULL,
    "interval" TEXT    NOT NULL,
    "userId"   INTEGER NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity"
(
    "id"        SERIAL         NOT NULL,
    "type"      "ActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3)   NOT NULL,
    "targetId"  INTEGER        NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- AddForeignKey
ALTER TABLE "Target"
    ADD CONSTRAINT "Target_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target"
    ADD CONSTRAINT "Target_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier"
    ADD CONSTRAINT "Tier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity"
    ADD CONSTRAINT "Activity_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
