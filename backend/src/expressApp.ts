import * as express from 'express';
import * as cors from 'cors';
import { errorHandler } from './middlwares/errorHandler';
import { initMovieController } from './controller/movieController';
import { initGenreController } from './controller/genreController';

export const expressApp = async (app: express.Express) => {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cors());

  //api
  initMovieController(app);
  initGenreController(app);
  //errorHandler
  app.use(errorHandler);
};
