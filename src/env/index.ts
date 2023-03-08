import { config } from "dotenv";
import { z } from "zod";

const dotEnvPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
config({ path: dotEnvPath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3333),
});

const dotEnvContent = envSchema.safeParse(process.env);

if (!dotEnvContent.success) {
  throw new Error(dotEnvContent.error.message);
}

export const env = dotEnvContent.data;
