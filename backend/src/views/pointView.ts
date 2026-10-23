import type { Point } from '../repositories/pointsRepository.js';

export function renderPoint(point: Point, baseUrl: string) {
  return {
    id: point.id,
    name: point.name,
    about: point.about,
    latitude: point.latitude,
    longitude: point.longitude,
    images: point.images.map((image) => ({
      id: image.id,
      url: `${baseUrl}/uploads/${image.path}`,
    })),
  };
}
