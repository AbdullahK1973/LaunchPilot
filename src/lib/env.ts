import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-5.4-mini"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export const env = schema.parse(process.env);
export const isDatabaseConfigured = Boolean(env.DATABASE_URL);
