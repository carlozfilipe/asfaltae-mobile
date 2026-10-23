import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (request, response, next) => {
  const startedAt = performance.now();

  response.on('finish', () => {
    const duration = Math.round(performance.now() - startedAt);
    console.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms`);
  });

  next();
};
