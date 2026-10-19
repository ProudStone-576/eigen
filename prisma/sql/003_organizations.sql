-- 003: organisations, classes, memberships, invitations, audit log, rate limits.
-- Generated with prisma migrate diff, then a backfill that moves every existing
-- user, assignment, custom question and session into one default organisation.
-- Additive only: no column or table is dropped.

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "ClassRole" AS ENUM ('TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "platformAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CustomItem" ADD COLUMN     "orgId" TEXT;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "orgId" TEXT;

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "classroomId" TEXT;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seatLimit" INTEGER,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ClassRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "classroomId" TEXT,
    "role" "OrgRole" NOT NULL DEFAULT 'STUDENT',
    "tokenHash" TEXT NOT NULL,
    "label" TEXT,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "meta" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_orgId_userId_key" ON "Membership"("orgId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_joinCode_key" ON "Classroom"("joinCode");

-- CreateIndex
CREATE INDEX "Classroom_orgId_archived_idx" ON "Classroom"("orgId", "archived");

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_classroomId_userId_key" ON "Enrollment"("classroomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "Invitation_orgId_createdAt_idx" ON "Invitation"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_orgId_createdAt_idx" ON "AuditEvent"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_createdAt_idx" ON "AuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomItem_orgId_nodeId_idx" ON "CustomItem"("orgId", "nodeId");

-- CreateIndex
CREATE INDEX "Attempt_userId_createdAt_idx" ON "Attempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Assignment_classroomId_archived_idx" ON "Assignment"("classroomId", "archived");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomItem" ADD CONSTRAINT "CustomItem_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Backfill ------------------------------------------------------------------
INSERT INTO "Organization" ("id", "name", "slug") VALUES ('org_default', 'Eigen', 'eigen')
  ON CONFLICT DO NOTHING;
INSERT INTO "Classroom" ("id", "orgId", "name", "joinCode")
  VALUES ('class_default', 'org_default', 'Class 1', upper(substr(md5(random()::text), 1, 6)))
  ON CONFLICT DO NOTHING;
INSERT INTO "Membership" ("id", "orgId", "userId", "role")
  SELECT 'mem_' || "id", 'org_default', "id",
         CASE WHEN "role" = 'TEACHER' THEN 'OWNER'::"OrgRole" ELSE 'STUDENT'::"OrgRole" END
  FROM "User" ON CONFLICT DO NOTHING;
INSERT INTO "Enrollment" ("id", "classroomId", "userId", "role")
  SELECT 'enr_' || "id", 'class_default', "id",
         CASE WHEN "role" = 'TEACHER' THEN 'TEACHER'::"ClassRole" ELSE 'STUDENT'::"ClassRole" END
  FROM "User" ON CONFLICT DO NOTHING;
UPDATE "User" SET "platformAdmin" = true WHERE "role" = 'TEACHER';
UPDATE "Assignment" SET "classroomId" = 'class_default' WHERE "classroomId" IS NULL;
UPDATE "CustomItem" SET "orgId" = 'org_default' WHERE "orgId" IS NULL;
UPDATE "Session" SET "orgId" = 'org_default' WHERE "orgId" IS NULL;
