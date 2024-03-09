import { validate } from 'class-validator';
import { Express, NextFunction, Request, Response } from 'express';
import httpStatusCodes from '../constants/httpStatusCodes';
import { ErrorCode, ErrorException } from '../exceptions';
import { GenreService } from '../services/genreService';
import { CreateGenre, UpdateGenre } from '../validators/genreValidator';
import { UUIDValidator } from '../validators/defaulValidator';

export const GenreController = (app: Express) => {
  const service = new GenreService();

  app.post(
    '/genre/create',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const genreNew = new CreateGenre();
        genreNew.description = req.body.description;
        genreNew.name = req.body.name;
        const errors = await validate(genreNew);
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
    '/genre/update',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const gendreUpdate = new UpdateGenre();
        const uuidFromRequest = new UUIDValidator();
        uuidFromRequest.id = String(req.query.id);
        gendreUpdate.description = req.body.description;
        gendreUpdate.name = req.body.name;
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
        const genre = await service.updateById(String(req.query.id), req.body);

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

        await service.deleteById(String(req.query.id));
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

        const genre = await service.getDetailsById(String(req.query.id));
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
        const genres = await service.getList();
        res.status(httpStatusCodes.OK).json(genres);
      } catch (err) {
        return next(new ErrorException(ErrorCode.UnknownError, [err]));
      }
    },
  );
};
