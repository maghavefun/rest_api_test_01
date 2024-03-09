import * as express from 'express';
import * as cors from 'cors';
import { errorHandler } from './middlwares/errorHandler';
import { MovieController } from './controller/movieController';
import { GenreController } from './controller/genreController';

export const expressApp = async (app: express.Express) => {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cors());

  //api
  MovieController(app);
  GenreController(app);
  //errorHandler
  app.use(errorHandler);
};
