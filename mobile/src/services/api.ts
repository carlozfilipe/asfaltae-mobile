import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

import { env } from '../config/env';
import { pointSchema, type CreatePointInput, type Point } from '../schemas/point';

const api = axios.create({ baseURL: env.EXPO_PUBLIC_API_URL, timeout: 15_000 });

api.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error)) {
    const { method, baseURL, url } = error.config ?? {};
    console.error(
      `[api] ${method?.toUpperCase()} ${baseURL}${url} falhou:`,
      error.response ? `${error.response.status} ${JSON.stringify(error.response.data)}` : error.message,
    );
  }

  return Promise.reject(error);
});

export async function listPoints(): Promise<Point[]> {
  const { data } = await api.get('/points');
  return z.array(pointSchema).parse(data);
}

export async function getPoint(id: number): Promise<Point> {
  const { data } = await api.get(`/points/${id}`);
  return pointSchema.parse(data);
}

export async function createPoint(input: CreatePointInput): Promise<Point> {
  const form = new FormData();

  form.append('name', input.name);
  form.append('about', input.about);
  form.append('latitude', String(input.latitude));
  form.append('longitude', String(input.longitude));

  input.images.forEach((uri, index) => {
    // React Native's FormData accepts file descriptors instead of Blobs.
    form.append('images', { uri, name: `image_${index}.jpg`, type: 'image/jpeg' } as unknown as Blob);
  });

  // Axios lets React Native set the multipart Content-Type (with boundary) itself.
  const { data } = await api.post('/points', form, { timeout: 60_000 });
  return pointSchema.parse(data);
}

export async function deletePoint(id: number): Promise<void> {
  await api.delete(`/points/${id}`);
}
