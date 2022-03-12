import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { ErrorResponse } from '../errors/custom-error';

export type APIErrorResponse = {
  errors: ErrorResponse
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<APIErrorResponse>,
  _next: NextFunction
): Response<APIErrorResponse> | undefined => {

    if (err instanceof CustomError) {
      return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    console.error(err);
    res.status(400).send({
      errors: [{ message: 'Something went wrong' }],
    });
};
