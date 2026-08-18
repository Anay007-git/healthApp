import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  SESSION_SECRET: z
    .string()
    .default("civiclens_default_super_secret_session_key_64_characters_long_str"),
  ADMIN_TOKEN: z.string().default("civiclens_admin_secret_token_12345"),
  AI_PROVIDER: z.string().default("openai"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  /** Optional web search provider key; unused when empty. Discovery still uses Google News RSS / Wikipedia / DDG. */
  SEARCH_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(process.env);
}
