import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/user.type';

export interface UserDoc extends User {
  id: string
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserDoc;
    }
  }
}
export const currentUser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_KEY!
    ) as UserDoc;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
