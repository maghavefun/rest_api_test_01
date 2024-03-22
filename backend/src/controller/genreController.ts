import { validate } from 'class-validator';
import { Express, NextFunction, Request, Response } from 'express';
import httpStatusCodes from '../constants/httpStatusCodes';
import { ErrorCode, ErrorException } from '../exceptions';
import { GenreService } from '../services/genreService';
import {
  GenreCreationValidator,
  GenreUpdatingValidator,
} from '../validators/genreValidator';
import { UUIDValidator } from '../validators/defaulValidator';
import { Genre } from 'src/entity/genreEntity';

export const initGenreController = (app: Express) => {
  const genreService = new GenreService();

  app.post(
    '/genre/create',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { description, name } = req.body;

        const genreNew = new GenreCreationValidator();
        genreNew.description = description;
        genreNew.name = name;
        const errors = await validate(genreNew);
        if (errors.length) {
          return next(new ErrorException(ErrorCode.ValidationError, errors));
        }

        const genreDTO: Omit<Genre, 'id' | 'movies'> = {
          name,
          description,
        };

        await genreService.create(genreDTO);
        return res.sendStatus(httpStatusCodes.CREATED);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.put(
    '/genre/update',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { description, name } = req.body;
        const gendreUpdate = new GenreUpdatingValidator();
        const uuidFromRequest = new UUIDValidator();
        uuidFromRequest.id = String(req.query.id);
        gendreUpdate.description = description;
        gendreUpdate.name = name;
        const errors = await validate(gendreUpdate);
        const uuidErrors = await validate(uuidFromRequest);
        if (errors.length || uuidErrors.length) {
          return next(
            new ErrorException(ErrorCode.ValidationError, [
              ...errors,
              ...uuidErrors,
            ]),
          );
        }

        const genreUpdateDTO: Partial<Omit<Genre, 'id' | 'movies'>> = {
          description,
          name,
        };

        const genre = await genreService.updateById(
          String(req.query.id),
          genreUpdateDTO,
        );

        if (!genre) {
          return next(new ErrorException(ErrorCode.UnknownError));
        }

        return res.status(httpStatusCodes.OK).json(genre);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.delete(
    '/genre/delete',
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

        await genreService.deleteById(String(req.query.id));
        return res.sendStatus(httpStatusCodes.OK);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.get(
    '/genre/details',
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

        const genre = await genreService.getDetailsById(String(req.query.id));
        return res.status(httpStatusCodes.OK).json(genre);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );

  app.get(
    '/genre/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const genres = await genreService.getList();
        res.status(httpStatusCodes.OK).json(genres);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );
};
