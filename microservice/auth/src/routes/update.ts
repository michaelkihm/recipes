import {
    BadRequestError, didMulterSaveImage, multerMiddleware, natsWrapper, requireAuth, UserEvent, validateRequest
}
from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { UserModel } from '../models/user';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateUserRequest = Request<any,any,{
    username: string;
    image: string
}>;


const processImageData = (req: UpdateUserRequest): string => {

    let image = '/api/users/images/profile-dummy.jpg';
    if(didMulterSaveImage(req)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `/api/users/images/${(req as any)?.file?.filename}`;
    }
    return image;

};

const updateUser = async (req: UpdateUserRequest, res: Response<UserEvent>) => {

    if(!req.currentUser || !req.currentUser?.id) throw new BadRequestError('No valid user id');
    const updatedUser = {
        ...req.currentUser,
        username: req.body.username,
        image: processImageData(req)
    };

    const user = await UserModel.findByIdAndUpdate(req.currentUser.id, updatedUser,{ new: true } );
    if(user) {
        const userResponse = {
            username: user.username,
            email: user.email,
            image: user.image || '',
        };
        await new UserUpdatedPublisher(natsWrapper.client).publish({
            version: user.version,
            user: userResponse,
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