import "server-only";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 10 * 1024 * 1024;

export function validateUpload(fileName: string, mimeType: string, size: number) {
  if (!allowedTypes.has(mimeType)) throw new Error("Only JPEG, PNG, and WebP images are supported.");
  if (size <= 0 || size > MAX_SIZE) throw new Error("Images must be 10 MB or smaller.");
  const extension = fileName.split(".").pop()?.toLowerCase() || "bin";
  return `${randomUUID()}.${extension}`;
}

export async function createPresignedUpload(key: string, mimeType: string) {
  if (!env.S3_ENDPOINT || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY || !env.S3_PUBLIC_URL) {
    throw new Error("Image storage is not configured.");
  }
  const client = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  });
  const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: mimeType }), { expiresIn: 300 });
  return { uploadUrl, publicUrl: `${env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}` };
}
