import cors from 'cors';
import express from 'express';

import { UPLOADS_DIR } from './config/paths.js';
import { errorHandler } from './errors/handler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { routes } from './routes.js';

export const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(routes);
app.use(errorHandler);
