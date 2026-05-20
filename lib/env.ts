import { z } from "zod";

/**
 * Skip strict validation during `next build` (no secrets in CI) or when opted out.
 * Runtime (`next start`, dev, serverless) still requires real values.
 */
const skipStrictEnvValidation =
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.NEXT_PHASE === "phase-production-build";

const buildPlaceholder: Record<string, string> = {
  DATABASE_URL: "mongodb://127.0.0.1:27017/build-placeholder",
  NEXTAUTH_SECRET: "build-placeholder-secret-min-32-chars-long",
  NEXTAUTH_URL: "http://localhost:3000",
};

function envSourceForParse(): NodeJS.ProcessEnv {
  if (!skipStrictEnvValidation) return process.env;
  const merged: NodeJS.ProcessEnv = { ...process.env };
  for (const [key, value] of Object.entries(buildPlaceholder)) {
    const current = merged[key];
    if (current === undefined || current === "") {
      merged[key] = value;
    }
  }
  return merged;
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().min(1, "NEXTAUTH_URL is required"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  REDIS_URL: z.string().optional(),

  NEXT_PUBLIC_GA_ID: z.string().optional(),
  /** Canonical site URL for metadata and absolute links (e.g. https://devpath.com) */
  NEXT_PUBLIC_APP_URL: z.string().optional(),
});

const source = envSourceForParse();

const parsed = envSchema.safeParse(source);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${JSON.stringify(parsed.error.format(), null, 2)}`,
  );
}

export const env = parsed.data;
