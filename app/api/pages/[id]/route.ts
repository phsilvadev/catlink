import { authenticated, jsonInput } from "@/lib/server/http";
import { getPage, savePage } from "@/lib/server/pages";
type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  return authenticated(request, (userId) => getPage(userId, id));
}
export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  return authenticated(request, async (userId) =>
    savePage(userId, id, await jsonInput(request)),
  );
}
