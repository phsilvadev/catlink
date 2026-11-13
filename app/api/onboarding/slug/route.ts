import { authenticated } from "@/lib/server/http";
import { getDb } from "@/lib/server/db";
import { slugSchema } from "@/lib/schemas/page";
export const runtime = "nodejs";
export function GET(request: Request) {
  return authenticated(request, async () => {
    const slug = slugSchema.parse(
      new URL(request.url).searchParams.get("slug"),
    );
    const page = await getDb().page.findUnique({
      where: { slug },
      select: { id: true },
    });
    return { slug, available: !page };
  });
}
