import { UserDoc } from '../../models/user';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const generateJWT = (user: UserDoc, req: Request): void => {
    
    const { id, email, image, username } = user;
    const userJwt = jwt.sign(
        { id, email, image, username },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_KEY!);
    req.session = {
        jwt: userJwt
        };
};