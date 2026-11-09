import { authenticated } from "@/lib/server/http";
import { uploadAvatar } from "@/lib/server/assets";
import { DomainError } from "@/lib/server/catalog";
export const runtime = "nodejs";
export function POST(request: Request) {
  return authenticated(request, async (userId) => {
    const reader = request.body?.getReader();
    if (!reader)
      throw new DomainError("VALIDATION", 400, "Selecione uma foto.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 5 * 1024 * 1024) {
        await reader.cancel();
        throw new DomainError("VALIDATION", 413, "A foto deve ter até 5 MB.");
      }
      chunks.push(value);
    }
    return uploadAvatar(userId, Buffer.concat(chunks));
  });
}
