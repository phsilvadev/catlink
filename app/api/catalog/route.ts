import { authenticated } from "@/lib/server/http";
import { listCatalog } from "@/lib/server/catalog";
export const runtime = "nodejs";
export function GET(request: Request) {
  return authenticated(request, listCatalog);
}
