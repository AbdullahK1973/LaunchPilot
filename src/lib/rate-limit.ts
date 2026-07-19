import "server-only";
import { getDb } from "@/lib/db";

type Bucket = { count: number };

/** Atomic PostgreSQL-backed rate limiting shared by every application replica. */
export async function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const rows = await getDb().$queryRawUnsafe<Bucket[]>(
    `INSERT INTO "RateLimitBucket" ("key", "count", "windowStart", "expiresAt")
     VALUES ($1, 1, $2, $3)
     ON CONFLICT ("key") DO UPDATE SET
       "count" = CASE WHEN "RateLimitBucket"."expiresAt" <= $2 THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
       "windowStart" = CASE WHEN "RateLimitBucket"."expiresAt" <= $2 THEN $2 ELSE "RateLimitBucket"."windowStart" END,
       "expiresAt" = CASE WHEN "RateLimitBucket"."expiresAt" <= $2 THEN $3 ELSE "RateLimitBucket"."expiresAt" END
     RETURNING "count"`,
    key, now, expiresAt,
  );
  return (rows[0]?.count ?? limit + 1) <= limit;
}
