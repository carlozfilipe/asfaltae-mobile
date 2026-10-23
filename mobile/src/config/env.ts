import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url({
    error: 'Defina EXPO_PUBLIC_API_URL no arquivo .env (veja .env.example).',
  }),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});
