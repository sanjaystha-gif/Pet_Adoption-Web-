import { z } from 'zod';

// Define environment schema
const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/pawbuddy'),
  JWT_ACCESS_SECRET: z.string().default('your_access_token_secret_change_in_production'),
  JWT_REFRESH_SECRET: z.string().default('your_refresh_token_secret_change_in_production'),
  ACCESS_TOKEN_EXPIRES: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  MAX_FILE_SIZE: z.string().default('5242880').transform(Number),
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
