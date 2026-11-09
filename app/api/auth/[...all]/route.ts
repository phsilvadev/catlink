import { getAuth } from "@/lib/server/auth";

export const runtime = "nodejs";
async function handler(request: Request) {
  // E-mail delivery was deferred. Do not expose nonfunctional recovery flows.
  const path = new URL(request.url).pathname;
  if (
    !new Set([
      "/api/auth/sign-up/email",
      "/api/auth/sign-in/email",
      "/api/auth/sign-out",
      "/api/auth/get-session",
    ]).has(path)
  ) {
    return Response.json(
      { message: "Recurso indisponível.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }
  try {
    return await getAuth().handler(request);
  } catch {
    return Response.json(
      {
        message: "Serviço temporariamente indisponível.",
        code: "SERVICE_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
}
export { handler as GET, handler as POST };
