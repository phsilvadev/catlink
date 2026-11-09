import { authenticated, jsonInput } from "@/lib/server/http";
import { readOnboarding, updateOnboarding } from "@/lib/server/onboarding";
export const runtime = "nodejs";
export function GET(request: Request) {
  return authenticated(request, readOnboarding);
}
export function POST(request: Request) {
  return authenticated(request, async (userId) =>
    updateOnboarding(userId, await jsonInput(request)),
  );
}
