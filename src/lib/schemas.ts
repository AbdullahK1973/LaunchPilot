import { z } from "zod";

export const authSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
});

const httpUrl = z.string().url().refine((value) => /^https?:\/\//i.test(value), "Use an http(s) URL.");
export const launchSchema = z.object({
  brandName: z.string().trim().min(2).max(120),
  brandTone: z.enum(["Premium", "Friendly", "Bold", "Clinical", "Playful"]),
  targetAudience: z.string().trim().min(10).max(3000),
  launchGoal: z.string().trim().min(10).max(2000),
  productName: z.string().trim().min(2).max(160),
  productCategory: z.string().trim().min(2).max(120),
  productDescription: z.string().trim().min(10).max(5000),
  keyFeatures: z.string().trim().min(3).max(3000),
  price: z.string().trim().min(1).max(80),
  competitorLink: z.union([httpUrl, z.literal("")]).optional(),
  existingProductUrl: z.union([httpUrl, z.literal("")]).optional(),
  specialNotes: z.string().max(4000).optional(),
});

export const outputSectionsSchema = z.object({
  sections: z.array(z.object({ title: z.string().min(1).max(120), body: z.union([z.string(), z.array(z.string())]) })).min(1).max(12),
});
