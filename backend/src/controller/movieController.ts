import { validate } from 'class-validator';
import { Express, NextFunction, Request, Response } from 'express';
import httpStatusCodes from '../constants/httpStatusCodes';
import { ErrorCode, ErrorException } from '../exceptions';
import { MovieService } from '../services/movieService';
import {
  MovieCreationValidator,
  MovieFilterOptions,
  MovieSortOptions,
  SortEnum,
  MovieUpdatingValidator,
} from '../validators/movieValidator';
import { UUIDValidator } from '../validators/defaulValidator';
import { Movie } from 'src/entity/movieEntity';

export const initMovieController = (app: Express) => {
  const movieService = new MovieService();

  app.post(
    '/movie/create',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          description,
          genres,
          localizedName,
          originalName,
          releaseYear,
          rating,
        } = req.body;

        const movieNew = new MovieCreationValidator();
        movieNew.description = description;
        movieNew.genres = genres;
        movieNew.localizedName = localizedName;
        movieNew.originalName = originalName;
        movieNew.releaseYear = releaseYear;
        movieNew.rating = rating;

        const errors = await validate(movieNew);
        if (errors.length) {
          return next(new ErrorException(ErrorCode.ValidationError, errors));
        }

        const movieDTO: Omit<Movie, 'id'> = {
          description,
          genres,
          localizedName,
          originalName,
          releaseYear,
          rating,
        };

        await movieService.create(movieDTO);
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
        const {
          description,
          genres,
          localizedName,
          originalName,
          rating,
          releaseYear,
        } = req.body;
        const movieUpdate = new MovieUpdatingValidator();
        movieUpdate.description = description;
        movieUpdate.genres = genres;
        movieUpdate.localizedName = localizedName;
        movieUpdate.originalName = originalName;
        movieUpdate.rating = rating;
        movieUpdate.releaseYear = releaseYear;
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

        const movideUpdateDTO: Partial<Omit<Movie, 'id'>> = {
          description,
          genres,
          localizedName,
          originalName,
          rating,
          releaseYear,
        };

        const movie = await movieService.updateById(
          String(req.query.id),
          movideUpdateDTO,
        );

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
        await movieService.deleteById(String(req.query.id));
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

        const movie = await movieService.getDetailsById(String(req.query.id));
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
        localizedName,
        originalName,
        rating,
        releaseYear,
        skip,
        take,
      } = req.query;
      const movieSortOptions = new MovieSortOptions();
      movieSortOptions.ratingSort = req.query.ratingSort as SortEnum;
      movieSortOptions.releaseYearSort = req.query.releaseYearSort as SortEnum;

      const sortOptionsErrors = await validate(movieSortOptions);

      const movieFilterOptions = new MovieFilterOptions();
      movieFilterOptions.genres = genres as string;
      movieFilterOptions.localizedName = localizedName as string;
      movieFilterOptions.originalName = originalName as string;
      if (rating) {
        movieFilterOptions.rating = Number(rating);
      }
      if (releaseYear) {
        movieFilterOptions.releaseYear = Number(releaseYear);
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
        const movies = await movieService.getListBy(
          movieFilterOptions,
          movieSortOptions,
        );
        res.status(httpStatusCodes.OK).json(movies);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );
};
