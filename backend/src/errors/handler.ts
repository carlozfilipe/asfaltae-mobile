import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { z, ZodError } from 'zod';

import { NotFoundError } from './NotFoundError.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    const errors = z.flattenError(error).fieldErrors;
    console.warn('Erro de validação:', errors);

    return response.status(400).json({ message: 'Erro de validação', errors });
  }

  if (error instanceof MulterError) {
    console.warn('Erro no upload:', error.message);

    return response.status(400).json({ message: error.message });
  }

  if (error instanceof NotFoundError) {
    return response.status(404).json({ message: error.message });
  }

  console.error(error);

  return response.status(500).json({ message: 'Internal server error' });
};
