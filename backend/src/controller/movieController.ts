import { validate } from 'class-validator';
import { Express, NextFunction, Request, Response } from 'express';
import httpStatusCodes from '../constants/httpStatusCodes';
import { ErrorCode, ErrorException } from '../exceptions';
import { MovieService } from '../services/movieService';
import {
  CreateMovie,
  MovieFilterOptions,
  MovieSortOptions,
  SortEnum,
  UpdateMovie,
} from '../validators/movieValidator';
import { UUIDValidator } from '../validators/defaulValidator';

export const MovieController = (app: Express) => {
  const service = new MovieService();

  app.post(
    '/movie/create',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const movieNew = new CreateMovie();
        movieNew.description = req.body.description;
        movieNew.genres = req.body.genres;
        movieNew.localized_name = req.body.localized_name;
        movieNew.original_name = req.body.original_name;
        movieNew.release_year = req.body.release_year;
        movieNew.rating = req.body.rating;

        const errors = await validate(movieNew);
        if (errors.length) {
          return next(new ErrorException(ErrorCode.ValidationError, errors));
        }

        await service.create(req.body);
        return res.sendStatus(httpStatusCodes.CREATED);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.put(
    '/movie/update',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const movieUpdate = new UpdateMovie();
        movieUpdate.description = req.body.description;
        movieUpdate.genres = req.body.genres;
        movieUpdate.localized_name = req.body.localized_name;
        movieUpdate.original_name = req.body.original_name;
        movieUpdate.rating = req.body.original_name;
        movieUpdate.release_year = req.body.release_year;
        const errors = await validate(movieUpdate);

        const uuidFromRequest = new UUIDValidator();
        uuidFromRequest.id = String(req.query.id);
        const uuidErrors = await validate(uuidFromRequest);

        if (errors.length || uuidErrors.length) {
          return next(
            new ErrorException(ErrorCode.ValidationError, [
              ...errors,
              ...uuidErrors,
            ]),
          );
        }

        const movie = await service.updateById(String(req.query.id), req.body);

        if (!movie) {
          return next(new ErrorException(ErrorCode.NotFound));
        }

        return res.status(httpStatusCodes.OK).json(movie);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.delete(
    '/movie/delete',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const uuidFromRequest = new UUIDValidator();
        uuidFromRequest.id = String(req.query.id);
        const uuidErrors = await validate(uuidFromRequest);

        if (uuidErrors.length) {
          return next(
            new ErrorException(ErrorCode.ValidationError, uuidErrors),
          );
        }
        await service.deleteById(String(req.query.id));
        return res.sendStatus(httpStatusCodes.OK);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.get(
    '/movie/details',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const uuidFromRequest = new UUIDValidator();
        uuidFromRequest.id = String(req.query.id);
        const uuidErrors = await validate(uuidFromRequest);

        if (uuidErrors.length) {
          return next(
            new ErrorException(ErrorCode.ValidationError, uuidErrors),
          );
        }

        const movie = await service.getDetailsById(String(req.query.id));
        return res.status(httpStatusCodes.OK).json(movie);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.get(
    '/movie/list',
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        genres,
        localized_name,
        original_name,
        rating,
        release_year,
        skip,
        take,
      } = req.query;
      const movieSortOptions = new MovieSortOptions();
      movieSortOptions.rating_sort = req.query.rating_sort as SortEnum;
      movieSortOptions.release_year_sort = req.query
        .release_year_sort as SortEnum;

      const sortOptionsErrors = await validate(movieSortOptions);

      const movieFilterOptions = new MovieFilterOptions();
      movieFilterOptions.genres = genres as string;
      movieFilterOptions.localized_name = localized_name as string;
      movieFilterOptions.original_name = original_name as string;
      if (rating) {
        movieFilterOptions.rating = Number(rating);
      }
      if (release_year) {
        movieFilterOptions.release_year = Number(release_year);
      }
      if (skip) {
        movieFilterOptions.skip = Number(skip);
      }
      if (take) {
        movieFilterOptions.take = Number(take);
      }

      const filterOptionsErrors = await validate(movieFilterOptions);

      if (filterOptionsErrors.length || sortOptionsErrors.length) {
        return next(
          new ErrorException(ErrorCode.ValidationError, [
            ...filterOptionsErrors,
            ...sortOptionsErrors,
          ]),
        );
      }

      try {
        const movies = await service.getListBy(
          movieFilterOptions,
          movieSortOptions,
        );
        res.status(httpStatusCodes.OK).json(movies);
      } catch (err) {
        console.log(err);
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );
};
