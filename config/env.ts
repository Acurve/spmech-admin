import { z } from "zod";

// 1. Define the schema for your environment variables
const envSchema = z.object({
    NEXT_PUBLIC_MODE: z.enum(["development", "production"]).default("development"),
    NEXT_PUBLIC_API_PREFIX: z.url(),
});

// 2. Parse process.env against the schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", z.treeifyError(_env.error));
    throw new Error("Invalid environment variables");
}

// 3. Export the validated object
export const env = _env.data;