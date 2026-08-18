import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  preferences: z.array(z.string()).optional().default(["CAG", "Schemes", "States"]),
});

export const askQuerySchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const schemeCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  ministry: z.string().min(2),
  launchYear: z.number().int().min(1947).max(2030),
  budgetAllocatedCr: z.number().nonnegative(),
  expenditureCr: z.number().nonnegative(),
  beneficiariesCount: z.number().nonnegative(),
  coverageTarget: z.string(),
  cagVerdict: z.enum(["SATISFACTORY", "PARTIAL_DISCREPANCY", "CRITICAL_DEFICIT", "UNAUDITED"]),
  summary: z.string(),
});

export const cagFindingCreateSchema = z.object({
  reportId: z.string(),
  title: z.string(),
  department: z.string(),
  financialImpactCr: z.number().nonnegative(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  findingSummary: z.string(),
  recommendation: z.string(),
});

export const evidenceCreateSchema = z.object({
  claim: z.string().min(5),
  evidenceSummary: z.string().min(10),
  sourceId: z.string(),
  pageNumber: z.number().optional(),
  methodology: z.string().optional(),
  verificationStatus: z.enum(["VERIFIED", "REVIEW_PENDING", "UNVERIFIED", "DISPUTED"]).default("REVIEW_PENDING"),
});

export const claimVerifySchema = z.object({
  text: z.string().min(3, "Claim text must be at least 3 characters long"),
  category: z.enum(["SCHEMES", "ELECTIONS", "ECONOMY", "HEALTH", "CAG_CORRUPTION", "GOVERNANCE", "LEGAL", "SPORTS", "SCIENCE_TECH", "WORLD_NEWS", "GENERAL"]).optional(),
});

export const claimSubmitSchema = z.object({
  claimText: z.string().min(10, "Claim text must be at least 10 characters long"),
  sourcePlatform: z.string().min(2, "Platform is required (e.g. WhatsApp, Twitter, YouTube)"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  userContact: z.string().optional(),
});

export const factCheckFilterSchema = z.object({
  category: z.string().optional(),
  verdict: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().optional().default(20),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type AskQueryInput = z.infer<typeof askQuerySchema>;
export type SchemeCreateInput = z.infer<typeof schemeCreateSchema>;
export type CAGFindingCreateInput = z.infer<typeof cagFindingCreateSchema>;
export type EvidenceCreateInput = z.infer<typeof evidenceCreateSchema>;
export type ClaimVerifyInput = z.infer<typeof claimVerifySchema>;
export type ClaimSubmitInput = z.infer<typeof claimSubmitSchema>;
export type FactCheckFilterInput = z.infer<typeof factCheckFilterSchema>;
