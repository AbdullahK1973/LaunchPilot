import "server-only";
import { randomUUID } from "crypto";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";
import { assertProductUploadKey, validateUploadMetadata } from "@/lib/upload-validation";

function getStorage() {
  if (!env.S3_ENDPOINT || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY || !env.S3_PUBLIC_URL) {
    throw new Error("Image storage is not configured.");
  }
  return {
    bucket: env.S3_BUCKET,
    publicUrl: env.S3_PUBLIC_URL.replace(/\/$/, ""),
    client: new S3Client({
      endpoint: env.S3_ENDPOINT, region: env.S3_REGION,
      credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
      forcePathStyle: true,
    }),
  };
}

export function validateUpload(fileName: string, mimeType: string, size: number) {
  const extension = validateUploadMetadata(fileName,mimeType,size);
  return `${randomUUID()}.${extension}`;
}

export async function createPresignedUpload(key: string, mimeType: string) {
  const storage = getStorage();
  const uploadUrl = await getSignedUrl(storage.client, new PutObjectCommand({ Bucket: storage.bucket, Key: key, ContentType: mimeType }), { expiresIn: 300 });
  return { uploadUrl };
}

export async function verifyStoredUpload(productId: string, key: string, expectedMimeType: string, expectedSize: number) {
  assertProductUploadKey(productId,key);
  validateUploadMetadata(key, expectedMimeType, expectedSize);
  const storage = getStorage();
  const object = await storage.client.send(new HeadObjectCommand({ Bucket: storage.bucket, Key: key }));
  if (object.ContentLength !== expectedSize) throw new Error("The uploaded file size does not match.");
  if (object.ContentType !== expectedMimeType) throw new Error("The uploaded file type does not match.");
  return `${storage.publicUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}
