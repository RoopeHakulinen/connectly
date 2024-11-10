-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'MESSAGE', 'OTHER');

-- CreateTable
CREATE TABLE "User"
(
    "id"    SERIAL NOT NULL,
    "email" TEXT   NOT NULL,
    "name"  TEXT   NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend"
(
    "id"     SERIAL  NOT NULL,
    "name"   TEXT    NOT NULL,
    "notes"  TEXT    NOT NULL,
    "userId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier"
(
    "id"       SERIAL  NOT NULL,
    "priority" INTEGER NOT NULL,
    "userId"   INTEGER NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity"
(
    "id"        SERIAL         NOT NULL,
    "type"      "ActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3)   NOT NULL,
    "friendId"  INTEGER        NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- AddForeignKey
ALTER TABLE "Friend"
    ADD CONSTRAINT "Friend_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend"
    ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier"
    ADD CONSTRAINT "Tier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity"
    ADD CONSTRAINT "Activity_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Friend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
