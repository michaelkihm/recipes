import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_STRING } from '../constants';

type AuthRequest = Request<{authorization: string}>;
type AuthRespone = Response<{message: string}>;

export const checkAuth = (req: AuthRequest, res: AuthRespone, next: NextFunction): void => {
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(req.headers);
        verify(token,SECRET_STRING);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed' });
    }
};