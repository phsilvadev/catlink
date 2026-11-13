import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "./db";
import { DomainError } from "./catalog";

function storage() {
  const endpoint = process.env.S3_ENDPOINT,
    bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID,
    secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey)
    throw new DomainError(
      "STORAGE_UNAVAILABLE",
      503,
      "O envio de fotos ainda não está configurado. Você pode continuar sem foto.",
    );
  return {
    bucket,
    client: new S3Client({
      endpoint,
      region: process.env.S3_REGION || "auto",
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
      credentials: { accessKeyId, secretAccessKey },
    }),
  };
}
export async function requireAvatar(
  db: Prisma.TransactionClient,
  userId: string,
  id?: string,
) {
  if (id && !(await db.asset.findFirst({ where: { id, ownerId: userId } })))
    throw new DomainError("NOT_FOUND", 404, "Foto não encontrada.");
}
export async function uploadAvatar(userId: string, bytes: Uint8Array) {
  if (bytes.byteLength > 5 * 1024 * 1024)
    throw new DomainError("VALIDATION", 413, "A foto deve ter até 5 MB.");
  let buffer: Buffer;
  try {
    const image = sharp(bytes, {
      limitInputPixels: 20_000_000,
      animated: false,
    });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format ?? ""))
      throw new Error("Invalid format");
    buffer = await image
      .rotate()
      .resize(512, 512, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new DomainError(
      "VALIDATION",
      400,
      "Envie uma imagem JPG, PNG ou WebP válida.",
    );
  }
  const { bucket, client } = storage(),
    key = `avatars/${randomUUID()}.webp`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
    }),
  );
  try {
    const asset = await getDb().asset.create({
      data: {
        ownerId: userId,
        storageKey: key,
        mimeType: "image/webp",
        bytes: buffer.length,
      },
    });
    return { id: asset.id };
  } catch (error) {
    await client
      .send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
      .catch(() => undefined);
    throw error;
  }
}
export async function readAvatar(userId: string, id: string) {
  const asset = await getDb().asset.findFirst({
    where: { id, ownerId: userId },
  });
  if (!asset) throw new DomainError("NOT_FOUND", 404, "Foto não encontrada.");
  const { bucket, client } = storage();
  const object = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: asset.storageKey }),
  );
  return object.Body?.transformToByteArray();
}
