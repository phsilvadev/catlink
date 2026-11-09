import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAuth } from "@/lib/server/auth";
import { getPage } from "@/lib/server/pages";
import { listCatalog } from "@/lib/server/catalog";
import { draftSchema, templateConfigSchema } from "@/lib/schemas/page";
import BioLinkEditor from "@/components/BioLinkEditor";
export const dynamic = "force-dynamic";
export default async function PageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuth()
    .api.getSession({ headers: await headers() })
    .catch(() => null);
  if (!session) redirect("/login");
  const { id } = await params;
  const page = await getPage(session.user.id, id).catch(() => null);
  if (!page) notFound();
  const catalog = await listCatalog(session.user.id);
  return (
    <BioLinkEditor
      allowedBlocks={catalog.blocks
        .filter((block) => block.allowed)
        .map((block) => block.key)}
      savedPage={{
        id: page.id,
        slug: page.slug,
        draft: draftSchema.parse(page.draft),
        theme: templateConfigSchema.parse(page.templateConfig),
      }}
    />
  );
}
