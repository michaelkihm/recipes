import { BadRequestError, requireAuth, validateRequest } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDoc } from '../models/recipe.model';
import { UserModel } from '../models/user.model';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

const updateBookmarks = async (
    req: Request<never, never,{ method: 'push' | 'pull', recipeId: string }>,
    res: Response<RecipeDoc[]>) => {
    
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const userId = req.currentUser!.id;
        const { recipeId, method } = req.body;
        const result = await UserModel.updateOne(
            { _id: userId },
            method === 'push' ? { $addToSet: { bookmarks: recipeId } } : { $pull: { bookmarks: recipeId } },
        );
        const user = await UserModel.findById(userId).populate('bookmarks');

        if(result.nModified && user) {
            res.send(user.bookmarks);
        } else throw new BadRequestError(`Could update bookmarks of user ${userId}`);
};

router.patch(
    '/api/recipes/bookmarks',
    requireAuth,
    [
        body('recipeId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Please provide valid MongoDB recipeId'),
        body('method')
            .not()
            .isEmpty()
            .custom((input: string) => input === 'push' || input === 'pull')
            .withMessage('body.method can only have values push or pull')
    ],
    validateRequest,
    updateBookmarks
);

export { router as updateUserBookmarksRouter };