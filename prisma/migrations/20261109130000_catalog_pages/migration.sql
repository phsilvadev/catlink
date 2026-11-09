-- CreateTable
CREATE TABLE "Plan" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pageLimit" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "userId" TEXT NOT NULL,
    "planKey" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Template" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "BlockDefinition" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockDefinition_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PlanTemplateAccess" (
    "planKey" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,

    CONSTRAINT "PlanTemplateAccess_pkey" PRIMARY KEY ("planKey","templateKey")
);

-- CreateTable
CREATE TABLE "PlanBlockAccess" (
    "planKey" TEXT NOT NULL,
    "blockKey" TEXT NOT NULL,

    CONSTRAINT "PlanBlockAccess_pkey" PRIMARY KEY ("planKey","blockKey")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "templateVersion" INTEGER NOT NULL,
    "templateConfig" JSONB NOT NULL,
    "draft" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "publishedVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedVersion" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "sourceRevision" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "document" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_publishedVersionId_key" ON "Page"("publishedVersionId");

-- CreateIndex
CREATE INDEX "Page_ownerId_idx" ON "Page"("ownerId");

-- CreateIndex
CREATE INDEX "PublishedVersion_pageId_idx" ON "PublishedVersion"("pageId");

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_planKey_fkey" FOREIGN KEY ("planKey") REFERENCES "Plan"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTemplateAccess" ADD CONSTRAINT "PlanTemplateAccess_planKey_fkey" FOREIGN KEY ("planKey") REFERENCES "Plan"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTemplateAccess" ADD CONSTRAINT "PlanTemplateAccess_templateKey_fkey" FOREIGN KEY ("templateKey") REFERENCES "Template"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBlockAccess" ADD CONSTRAINT "PlanBlockAccess_planKey_fkey" FOREIGN KEY ("planKey") REFERENCES "Plan"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBlockAccess" ADD CONSTRAINT "PlanBlockAccess_blockKey_fkey" FOREIGN KEY ("blockKey") REFERENCES "BlockDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_templateKey_fkey" FOREIGN KEY ("templateKey") REFERENCES "Template"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_publishedVersionId_fkey" FOREIGN KEY ("publishedVersionId") REFERENCES "PublishedVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enforce product invariants independently of application validation.
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_pageLimit_check" CHECK ("pageLimit" > 0 AND (key <> 'FREE' OR "pageLimit" = 1));
ALTER TABLE "Template" ADD CONSTRAINT "Template_version_check" CHECK (version > 0);
ALTER TABLE "BlockDefinition" ADD CONSTRAINT "BlockDefinition_version_check" CHECK ("schemaVersion" > 0);
ALTER TABLE "Page" ADD CONSTRAINT "Page_slug_check" CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 40);
ALTER TABLE "Page" ADD CONSTRAINT "Page_revision_check" CHECK (revision > 0);
-- The public pointer may reference only a snapshot belonging to this page.
CREATE UNIQUE INDEX "PublishedVersion_pageId_id_key" ON "PublishedVersion" ("pageId", id);
ALTER TABLE "Page" ADD CONSTRAINT "Page_publishedVersion_owner_check" FOREIGN KEY (id, "publishedVersionId") REFERENCES "PublishedVersion" ("pageId", id) DEFERRABLE INITIALLY DEFERRED;
