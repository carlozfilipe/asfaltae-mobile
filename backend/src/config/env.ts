import { z } from 'zod';

z.config(z.locales.ptBR());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_PATH: z.string().min(1).default('./data/database.sqlite'),
  PUBLIC_URL: z.preprocess((value) => value || undefined, z.url().optional()),
});

export const env = envSchema.parse(process.env);
