import { Request, Response, NextFunction } from 'express';
import httpStatusCodes from '../constants/httpStatusCodes';
import { ErrorCode, ErrorException } from '../exceptions';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ErrorException) {
    return res.status(error.status).send(error);
  }

  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
    code: ErrorCode.UnknownError,
    status: httpStatusCodes.INTERNAL_SERVER_ERROR,
  });
};
