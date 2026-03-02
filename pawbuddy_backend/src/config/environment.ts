import { z } from 'zod';

// Define environment schema
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('mongodb://localhost:27017/pawbuddy'),
  JWT_SECRET: z.string().default('your_jwt_secret_change_in_production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  MAX_FILE_SIZE: z.string().default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
};

export const env = parseEnv();

// Export typed environment object
export type Env = z.infer<typeof envSchema>;
