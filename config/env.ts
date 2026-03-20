import { z } from "zod";

// 1. Define the schema for your environment variables
const envSchema = z.object({
    MODE: z.enum(["development", "production"]).default("development"),
    API_PREFIX: z.string(),
});

// 2. Parse process.env against the schema
const _env = envSchema.safeParse({
    MODE: process.env.NEXT_PUBLIC_MODE,
    API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
})

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error);
    throw new Error("Invalid environment variables");
}

// 3. Export the validated object
export const env = _env.data;