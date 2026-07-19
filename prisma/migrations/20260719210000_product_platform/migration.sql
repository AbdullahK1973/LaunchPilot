CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
CREATE TYPE "UsageStatus" AS ENUM ('RESERVED', 'SUCCEEDED', 'FAILED');
CREATE TYPE "PublishStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "OutputRevision" ADD COLUMN "createdById" TEXT;
ALTER TABLE "UsageEvent" ADD COLUMN "requestId" TEXT, ADD COLUMN "status" "UsageStatus" NOT NULL DEFAULT 'SUCCEEDED';
ALTER TABLE "Integration" ADD COLUMN "lastError" TEXT, ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

CREATE TABLE "PasswordResetToken" ("id" TEXT PRIMARY KEY, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "usedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "EmailVerificationToken" ("id" TEXT PRIMARY KEY, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "usedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Invitation" ("id" TEXT PRIMARY KEY, "workspaceId" TEXT NOT NULL, "email" TEXT NOT NULL, "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER', "tokenHash" TEXT NOT NULL, "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING', "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "acceptedAt" TIMESTAMP(3));
CREATE TABLE "RateLimitBucket" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL DEFAULT 0, "windowStart" TIMESTAMP(3) NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "StripeEvent" ("id" TEXT PRIMARY KEY, "type" TEXT NOT NULL, "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "AuditEvent" ("id" TEXT PRIMARY KEY, "workspaceId" TEXT NOT NULL, "actorId" TEXT, "action" TEXT NOT NULL, "targetType" TEXT, "targetId" TEXT, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "AnalyticsEvent" ("id" TEXT PRIMARY KEY, "workspaceId" TEXT NOT NULL, "name" TEXT NOT NULL, "properties" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Comment" ("id" TEXT PRIMARY KEY, "workspaceId" TEXT NOT NULL, "revisionId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "body" TEXT NOT NULL, "resolvedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "PublishJob" ("id" TEXT PRIMARY KEY, "workspaceId" TEXT NOT NULL, "integrationId" TEXT NOT NULL, "revisionId" TEXT NOT NULL, "status" "PublishStatus" NOT NULL DEFAULT 'PENDING', "externalId" TEXT, "externalUrl" TEXT, "error" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL);

CREATE UNIQUE INDEX "Brand_workspaceId_name_key" ON "Brand"("workspaceId", "name");
CREATE UNIQUE INDEX "Output_launchId_actionId_key" ON "Output"("launchId", "actionId");
CREATE UNIQUE INDEX "UsageEvent_requestId_key" ON "UsageEvent"("requestId");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");
CREATE INDEX "Invitation_workspaceId_status_idx" ON "Invitation"("workspaceId", "status");
CREATE INDEX "Invitation_email_status_idx" ON "Invitation"("email", "status");
CREATE INDEX "AuditEvent_workspaceId_createdAt_idx" ON "AuditEvent"("workspaceId", "createdAt");
CREATE INDEX "AnalyticsEvent_workspaceId_name_createdAt_idx" ON "AnalyticsEvent"("workspaceId", "name", "createdAt");
CREATE INDEX "Comment_revisionId_createdAt_idx" ON "Comment"("revisionId", "createdAt");
CREATE INDEX "PublishJob_workspaceId_createdAt_idx" ON "PublishJob"("workspaceId", "createdAt");

ALTER TABLE "OutputRevision" ADD CONSTRAINT "OutputRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "OutputRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "OutputRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
