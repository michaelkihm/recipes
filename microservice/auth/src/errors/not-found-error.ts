import { CustomError, SerializeErrors } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): SerializeErrors {
    return [{ message: 'Not Found' }];
  }
}
