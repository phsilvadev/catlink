-- CreateTable
CREATE TABLE "Onboarding" (
    "userId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "state" JSONB NOT NULL,
    "completedPageId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_completedPageId_key" ON "Onboarding"("completedPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_storageKey_key" ON "Asset"("storageKey");

-- CreateIndex
CREATE INDEX "Asset_ownerId_idx" ON "Asset"("ownerId");

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_completedPageId_fkey" FOREIGN KEY ("completedPageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Approved initial free catalog. Preserve existing item versions/configuration.
INSERT INTO "Plan" (key,name,"pageLimit",active) VALUES ('FREE','Gratuito',1,true) ON CONFLICT(key) DO NOTHING;
INSERT INTO "Template" (key,name,description,version,config,active,"updatedAt") VALUES ('basic','Básico','Uma página simples para apresentar seu perfil e links.',1,'{"schemaVersion":1,"background":"#ffffff","foreground":"#111827","accent":"#6366f1","initialBlocks":[]}'::jsonb,true,NOW()) ON CONFLICT(key) DO NOTHING;
INSERT INTO "BlockDefinition" (key,name,description,active,"schemaVersion","updatedAt") VALUES
('text','Texto','Texto de apresentação.',true,1,NOW()),('link','Link','Endereço externo.',true,1,NOW()),('button','Botão','Botão com destino.',true,1,NOW()),('image','Imagem','Imagem com texto alternativo.',true,1,NOW()),('social','Redes sociais','Links das suas redes.',true,1,NOW()) ON CONFLICT(key) DO NOTHING;
INSERT INTO "PlanTemplateAccess" ("planKey","templateKey") VALUES ('FREE','basic') ON CONFLICT DO NOTHING;
INSERT INTO "PlanBlockAccess" ("planKey","blockKey") VALUES ('FREE','text'),('FREE','link'),('FREE','button'),('FREE','image'),('FREE','social') ON CONFLICT DO NOTHING;
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_revision_check" CHECK (revision >= 0);
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_bytes_check" CHECK (bytes > 0 AND bytes <= 5242880);
