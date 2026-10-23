import { rm } from 'node:fs/promises';
import path from 'node:path';

import { UPLOADS_DIR } from '../config/paths.js';

export async function removeUploads(fileNames: string[]) {
  await Promise.allSettled(fileNames.map((fileName) => rm(path.join(UPLOADS_DIR, fileName), { force: true })));
}
