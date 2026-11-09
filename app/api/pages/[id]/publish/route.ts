import { authenticated, jsonInput } from "@/lib/server/http";
import { publishPage, unpublishPage } from "@/lib/server/pages";
type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  return authenticated(request, async (userId) =>
    publishPage(userId, id, await jsonInput(request)),
  );
}
export async function DELETE(request: Request, context: Context) {
  const { id } = await context.params;
  return authenticated(request, (userId) => unpublishPage(userId, id));
}
