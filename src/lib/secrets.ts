import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { env } from "@/lib/env";
function key(){if(!env.INTEGRATION_ENCRYPTION_KEY)throw new Error("INTEGRATION_ENCRYPTION_KEY must be configured.");return createHash("sha256").update(env.INTEGRATION_ENCRYPTION_KEY).digest()}
export function encryptSecret(value:string){const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv),encrypted=Buffer.concat([cipher.update(value,"utf8"),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(v=>v.toString("base64url")).join(".")}
export function decryptSecret(value:string){const [iv,tag,data]=value.split(".").map(v=>Buffer.from(v,"base64url")),decipher=createDecipheriv("aes-256-gcm",key(),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString("utf8")}
