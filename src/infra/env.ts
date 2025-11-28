import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string(),
});
