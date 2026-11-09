import { authenticated, jsonInput } from "@/lib/server/http";
import { createPage, listPages } from "@/lib/server/pages";
export const runtime = "nodejs";
export function GET(request: Request) {
  return authenticated(request, listPages);
}
export function POST(request: Request) {
  return authenticated(request, async (userId) =>
    createPage(userId, await jsonInput(request)),
  );
}
