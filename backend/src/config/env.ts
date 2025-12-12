import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI variable is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET variable is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables");
  console.error(parsed.error.issues);
  process.exit(1);
}

export const env = parsed.data;
