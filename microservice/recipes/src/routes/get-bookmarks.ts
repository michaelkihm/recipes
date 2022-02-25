import { BadRequestError, requireAuth } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDoc } from '../models/recipe.model';
import { UserModel } from '../models/user.model';

const router = express.Router();

const getBookmarks = async (req: Request, res: Response<RecipeDoc[]>) => {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId = req.currentUser!.id;
    const user = await UserModel.findById(userId).populate('bookmarks');
    if(user){
        res.send(user.bookmarks);
    } else throw new BadRequestError(`Could not find user ${userId}`);

};

router.get(
    '/api/recipes/bookmarks',
    requireAuth,
    getBookmarks
);

export { router as getUserBookmarksRouter };