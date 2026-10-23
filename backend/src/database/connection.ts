import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

import { env } from '../config/env.js';
import { schema } from './schema.js';

mkdirSync(path.dirname(env.DATABASE_PATH), { recursive: true });

export const db = new Database(env.DATABASE_PATH);

db.pragma('journal_mode = WAL');
// SQLite ignores ON DELETE CASCADE unless foreign keys are enabled on every connection.
db.pragma('foreign_keys = ON');
db.exec(schema);
