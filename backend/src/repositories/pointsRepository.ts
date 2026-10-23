import { db } from '../database/connection.js';
import type { CreatePointInput } from '../schemas/point.js';

export interface Image {
  id: number;
  path: string;
}

export interface Point {
  id: number;
  name: string;
  about: string;
  latitude: number;
  longitude: number;
  images: Image[];
}

type PointRow = Omit<Point, 'images'> & { images: string };

const selectPointsWithImages = /* sql */ `
  SELECT
    p.id, p.name, p.about, p.latitude, p.longitude,
    COALESCE(
      json_group_array(json_object('id', i.id, 'path', i.path)) FILTER (WHERE i.id IS NOT NULL),
      '[]'
    ) AS images
  FROM points p
  LEFT JOIN images i ON i.point_id = p.id
`;

const statements = {
  findAll: db.prepare<[], PointRow>(`${selectPointsWithImages} GROUP BY p.id ORDER BY p.id`),
  findById: db.prepare<[number], PointRow>(`${selectPointsWithImages} WHERE p.id = ? GROUP BY p.id`),
  insertPoint: db.prepare<Omit<CreatePointInput, 'images'>>(
    'INSERT INTO points (name, about, latitude, longitude) VALUES (@name, @about, @latitude, @longitude)',
  ),
  insertImage: db.prepare<[string, number]>('INSERT INTO images (path, point_id) VALUES (?, ?)'),
  findImagePaths: db.prepare<[number], string>('SELECT path FROM images WHERE point_id = ?').pluck(),
  deletePoint: db.prepare<[number]>('DELETE FROM points WHERE id = ?'),
};

function toPoint({ images, ...row }: PointRow): Point {
  return { ...row, images: JSON.parse(images) as Image[] };
}

export function findAllPoints(): Point[] {
  return statements.findAll.all().map(toPoint);
}

export function findPointById(id: number): Point | undefined {
  const row = statements.findById.get(id);
  return row && toPoint(row);
}

export const createPoint = db.transaction(({ images, ...point }: CreatePointInput): Point => {
  const id = Number(statements.insertPoint.run(point).lastInsertRowid);

  for (const imagePath of images) {
    statements.insertImage.run(imagePath, id);
  }

  return findPointById(id)!;
});

/**
 * Deletes a point (its images rows are removed by ON DELETE CASCADE).
 * Returns the deleted image file paths, or `null` when the point does not exist.
 */
export const deletePoint = db.transaction((id: number): string[] | null => {
  const imagePaths = statements.findImagePaths.all(id);
  const { changes } = statements.deletePoint.run(id);

  return changes > 0 ? imagePaths : null;
});
