import { z } from 'zod';

export const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const pointSchema = coordinatesSchema.extend({
  id: z.number(),
  name: z.string(),
  about: z.string(),
  images: z.array(
    z.object({
      id: z.number(),
      url: z.url(),
    }),
  ),
});

export const createPointSchema = coordinatesSchema.extend({
  name: z.string().trim().min(1, 'Informe o nome do ponto.'),
  about: z
    .string()
    .trim()
    .min(1, 'Informe os detalhes do ponto.')
    .max(300, 'Os detalhes devem ter no máximo 300 caracteres.'),
  images: z.array(z.string()),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Point = z.infer<typeof pointSchema>;
export type CreatePointInput = z.infer<typeof createPointSchema>;
