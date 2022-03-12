import { BadRequestError, requireAuth, natsWrapper } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { UserDeletedPublisher } from '../events/publishers/user-deleted-publisher';
import { UserModel } from '../models/user';

const router = express.Router();

const deleteUser = async (req: Request, res: Response<{message: string}>) => {

    if(!req.currentUser) {
        throw new BadRequestError('User have to be logged in');
    }
    const currentUserId = req.currentUser.id;

    try {
        const user = await UserModel.findByIdAndDelete(currentUserId);
        if(!user) throw new BadRequestError(`User with id ${currentUserId} does not exist and can not be deleted`);
        await new UserDeletedPublisher(natsWrapper.client).publish({
            userId: currentUserId,
            version: user.version,
        });
        req.session = null; //logout user
        res.status(200).send({ message: `Deleted user ${currentUserId}` });
    } catch(err) {
        throw new BadRequestError(`User with id ${currentUserId} does not exist and can not be deleted`);
    }
    
};

router.delete(
    '/api/users',
    requireAuth,
    deleteUser
    );

export { router as deleteUserRouter };