import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import PointsController from './controllers/PointsController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show);
routes.post('/points', upload.array('images'), PointsController.create);

export default routes;