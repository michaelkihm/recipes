import { BadRequestError, requireAuth, validateRequest, natsWrapper } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { UserDeletedPublisher } from '../events/publishers/user-deleted-publisher';
import { UserModel } from '../models/user';

const router = express.Router();

const deleteUser = async (req: Request<{id: string}>, res: Response<{message: string}>) => {

    if(req.currentUser?.id !== req.params.id) {
        throw new BadRequestError('User id and currentUser.id have to be equal');
    }

    try {
        await UserModel.findByIdAndDelete(req.params.id);
        await new UserDeletedPublisher(natsWrapper.client).publish({ id: req.params.id });
        req.session = null; //logout user
        res.status(200).send({ message: `Deleted user ${req.params.id}` });
    } catch(err) {
        throw new BadRequestError(`User with id ${req.params.id} does not exist and can not be deleted`);
    }
    
};

router.delete(
    '/api/users/:id',
    requireAuth,
    [
        param('id')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('User Id must be a valid Mongo Object id')
    ],
    validateRequest,
    deleteUser
    );

export { router as deleteUserRouter };