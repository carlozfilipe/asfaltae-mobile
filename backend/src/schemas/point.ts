import { z } from 'zod';

export const pointIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createPointSchema = z.object({
  name: z.string().trim().min(1),
  about: z.string().trim().min(1).max(300),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  images: z.array(z.string().min(1)),
});

export type CreatePointInput = z.infer<typeof createPointSchema>;
