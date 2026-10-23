import { randomUUID } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';

import { UPLOADS_DIR } from './paths.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_request, file, callback) => {
      callback(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'));
  },
});
