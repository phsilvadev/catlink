import "server-only";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { getAuth } from "./auth";
import { DomainError } from "./catalog";

export async function authenticated(
  request: Request,
  operation: (userId: string) => Promise<unknown>,
) {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      const origin = request.headers.get("origin");
      const expected = process.env.BETTER_AUTH_URL;
      if (!expected || origin !== new URL(expected).origin)
        throw new DomainError("INVALID_ORIGIN", 403, "Origem não permitida.");
    }
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      throw new DomainError("UNAUTHENTICATED", 401, "Entre na sua conta.");
    const data = await operation(session.user.id);
    return Response.json(
      { data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof DomainError)
      return Response.json(
        { code: error.code, message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    if (error instanceof ZodError || error instanceof SyntaxError)
      return Response.json(
        { code: "VALIDATION", message: "Confira os dados informados." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return Response.json(
        { code: "CONFLICT", message: "Esse endereço já está em uso." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    return Response.json(
      { code: "UNAVAILABLE", message: "Serviço temporariamente indisponível." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export async function jsonInput(request: Request) {
  // Bound the body before JSON parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) throw new DomainError("VALIDATION", 400, "Informe os dados.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1024 * 1024) {
      await reader.cancel();
      throw new DomainError("VALIDATION", 413, "Conteúdo muito grande.");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}
