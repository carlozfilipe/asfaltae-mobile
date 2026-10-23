import { Router } from 'express';

import { upload } from './config/upload.js';
import * as pointsController from './controllers/pointsController.js';

export const routes = Router();

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', upload.array('images'), pointsController.create);
routes.delete('/points/:id', pointsController.remove);
