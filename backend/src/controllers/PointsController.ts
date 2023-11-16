import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import pointsView from '../views/points_view';
import Point from '../models/Point';
import * as Yup from 'yup';

export default {

  async index(request: Request, response: Response) {
    const pointsRepository = getRepository(Point);

    const points = await pointsRepository.find({
      relations: ['images']
    });

    return response.json(pointsView.renderMany(points));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const pointsRepository = getRepository(Point);

    const point = await pointsRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(pointsView.render(point));
  },

  async create(request: Request, response: Response) {

    const {
      name,
      about,
      latitude,
      longitude,
    } = request.body;

    console.log(" >>> received request: ", name, about, latitude, longitude);
    
    const pointsRepository = getRepository(Point);
    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return { 
        path: image.filename 
      }
    })

    const data = {
      name,
      about,
      latitude,
      longitude,
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      about: Yup.string().required().max(300),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    })

    const point = pointsRepository.create(data)
  
    await pointsRepository.save(point);
  
    return response.status(201).json(point);
  }
}