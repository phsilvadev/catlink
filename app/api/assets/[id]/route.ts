import { getAuth } from "@/lib/server/auth";
import { readAvatar } from "@/lib/server/assets";
import { DomainError } from "@/lib/server/catalog";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return new Response(null, {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
    const { id } = await params;
    const image = await readAvatar(session.user.id, id);
    if (!image) return new Response(null, { status: 404 });
    return new Response(Buffer.from(image), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return new Response(null, {
      status: error instanceof DomainError ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
