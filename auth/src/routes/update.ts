import {
    BadRequestError, didMulterSaveImage, multerMiddleware, natsWrapper, requireAuth, UserEvent, validateRequest
}
from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { defaultImageUrl } from '../constants';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { UserModel } from '../models/user';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateUserRequest = Request<any,any,{
    username: string;
    image: string
}>;


const processImageData = (req: UpdateUserRequest): string => {

    let image = defaultImageUrl;
    if(didMulterSaveImage(req)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `/api/users/images/${(req as any)?.file?.filename}`;
    }
    return image;

};

const updateUser = async (req: UpdateUserRequest, res: Response<UserEvent>) => {

    if(!req.currentUser || !req.currentUser?.id) throw new BadRequestError('No valid user id');

    const user = await UserModel.findById(req.currentUser.id );
    if(user) {
        const newImage = processImageData(req);
        user.set({
            username: req.body.username,
            image: newImage !== defaultImageUrl ? newImage : user.image,
        });
        await user.save();
        const userResponse = {
            username: user.username,
            email: user.email,
            image: user.image || '',
        };
        await new UserUpdatedPublisher(natsWrapper.client).publish({
            version: user.version,
            user: userResponse,
            userId: user.id,
        });
        res.status(200).send(userResponse);
    } else throw new BadRequestError(`Could not update user ${req.currentUser.id}`);
};

router.put(
    '/api/users',
    requireAuth,
    multerMiddleware('images'),
    [
        body('username').not().isEmpty().withMessage('Please provide valid username'),
    ],
    validateRequest,
    updateUser
);


export { router as updateUserRouter };