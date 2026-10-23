import type { Request, Response } from 'express';

import { env } from '../config/env.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import * as pointsRepository from '../repositories/pointsRepository.js';
import { createPointSchema, pointIdSchema } from '../schemas/point.js';
import { removeUploads } from '../utils/uploads.js';
import { renderPoint } from '../views/pointView.js';

function baseUrl(request: Request) {
  return env.PUBLIC_URL ?? `${request.protocol}://${request.get('host')}`;
}

export function index(request: Request, response: Response) {
  const points = pointsRepository.findAllPoints();

  return response.json(points.map((point) => renderPoint(point, baseUrl(request))));
}

export function show(request: Request, response: Response) {
  const { id } = pointIdSchema.parse(request.params);
  const point = pointsRepository.findPointById(id);

  if (!point) throw new NotFoundError('Ponto não encontrado');

  return response.json(renderPoint(point, baseUrl(request)));
}

export async function create(request: Request, response: Response) {
  const files = (request.files ?? []) as Express.Multer.File[];
  const images = files.map((file) => file.filename);

  const result = createPointSchema.safeParse({ ...request.body, images });

  if (!result.success) {
    await removeUploads(images);
    throw result.error;
  }

  const point = pointsRepository.createPoint(result.data);

  return response.status(201).json(renderPoint(point, baseUrl(request)));
}

export async function remove(request: Request, response: Response) {
  const { id } = pointIdSchema.parse(request.params);
  const imagePaths = pointsRepository.deletePoint(id);

  if (!imagePaths) throw new NotFoundError('Ponto não encontrado');

  await removeUploads(imagePaths);

  return response.json({ message: 'Ponto excluído com sucesso!' });
}
